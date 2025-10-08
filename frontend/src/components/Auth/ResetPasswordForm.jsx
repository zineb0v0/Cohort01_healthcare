import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { Button } from '../ui/button';  // the reusable Button component

const ResetPasswordForm = () => {
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const token = urlParams.get('token');
  const email = urlParams.get('email');
  console.log(token);  // 'abc123' (if token=abc123 in the URL)
  console.log(email);  // 'user@example.com' (if email=user@example.com in the URL)
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');  // General error message
  const [errors, setErrors] = useState([]); // Specific form validation errors
  const [status, setStatus] = useState(null); // Status message for success

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error state before starting the request
    setErrors([]); // Reset validation errors
    setStatus(null); // Reset status message

    try {
      const response = await axios.post(
        'http://localhost/api/reset-password',
        { token, email, password, password_confirmation: passwordConfirmation }
      );

      toast.success(response.data.message);  // Show success message
      setStatus('Your password has been successfully reset.'); // Display success status
      setPassword(''); // Clear password field on success
      setPasswordConfirmation(''); // Clear password confirmation field on success
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);  // Set form validation errors
      }
      setError(error.response?.data?.message || 'Failed to reset password.');
      toast.error(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);  // Stop loading spinner
    }
  };

  return (
   <div className="max-w-sm mx-auto p-4">
  <h1 className="text-2xl font-bold text-center mb-4">Réinitialiser votre mot de passe</h1>
  <p className="text-center mb-6 text-gray-600">
    Veuillez entrer votre nouveau mot de passe ci-dessous.
  </p>

  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Entrez un nouveau mot de passe"
    className="w-full p-3 border border-gray-300 rounded-md mb-4"
  />

  <input
    type="password"
    value={passwordConfirmation}
    onChange={(e) => setPasswordConfirmation(e.target.value)}
    placeholder="Confirmer le nouveau mot de passe"
    className="w-full p-3 border border-gray-300 rounded-md mb-4"
  />

  {errors.password && (
    <p className="text-red-500 text-sm text-center mb-4">{errors.password[0]}</p> 
  )}
  {errors.password_confirmation && (
    <p className="text-red-500 text-sm text-center mb-4">{errors.password_confirmation[0]}</p> 
  )}

  {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

  <Button onClick={handleResetPassword} disabled={loading} className="w-full p-5">
    {loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
  </Button>
</div>

  );
};

export default ResetPasswordForm;
