import { useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../authentication/axios";
import { toast } from "react-hot-toast";
import { Button } from "../../Components/ui/button";

const ResetPasswordForm = () => {
  const { search } = useLocation();
  const urlParams = new URLSearchParams(search);
  const token = urlParams.get("token");
  const email = urlParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setError("");

    try {
      const response = await api.post("/api/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      toast.success(response.data.message || "Mot de passe réinitialisé !");
      setPassword("");
      setPasswordConfirmation("");
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else {
        setError(err.response?.data?.message || "Une erreur est survenue !");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl my-15  mx-auto p-6 sm:p-10 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center mb-8">
        Réinitialiser votre mot de passe
      </h1>
      <p className="text-center text-base sm:text-lg mb-6 text-gray-600">
        Veuillez entrer votre nouveau mot de passe ci-dessous :
      </p>

      <form className="w-full flex flex-col gap-4" onSubmit={handleResetPassword}>
        {/* Password field */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Entrez un nouveau mot de passe"
          className="w-full p-4 text-base sm:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm sm:text-base">{errors.password[0]}</p>
        )}

        {/* Password confirmation field */}
        <input
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder="Confirmer le nouveau mot de passe"
          className="w-full p-4 text-base sm:text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password_confirmation && (
          <p className="text-red-500 text-sm sm:text-base">{errors.password_confirmation[0]}</p>
        )}

        {/* General error */}
        {error && (
          <p className="text-red-500 text-sm sm:text-base text-center">{error}</p>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-4 sm:py-5 bg-foreground/90 text-base sm:text-lg text-white font-semibold mt-4"
        >
          {loading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
