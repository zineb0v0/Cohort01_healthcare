
import React, { useState } from "react";
import axios from "../../axios";
import { toast } from "sonner"; 
import { Button } from "../ui/button"; 

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // General error message
  const [errors, setErrors] = useState([]); // Specific form validation errors

  // Function to fetch CSRF token
  const getCsrfCookie = async () => {
    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true, // Ensuring cookies are sent
      });
      console.log("CSRF cookie set!");
    } catch (error) {
      console.error("Error fetching CSRF cookie:", error);
  
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error state before starting the request
    setErrors([]); // Reset validation errors

    try {
      // Fetch CSRF token before sending the request
      await getCsrfCookie();

      // Send forgot password request
      const response = await axios.post(
        "api/forgotPassword", // Your API endpoint
        { email: email },
        {
          withCredentials: true, // Make sure cookies are sent with the request
        }
      );

      toast.success(response.data.message, {
        style: {
          backgroundColor: "#15a018",
          color: "white",
        },
      });
      setEmail(""); // Clear email field on success
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors); // Set form validation errors
      }
      console.error("Error details:", error);
      setError(error.response?.data?.message || "Something went wrong!");
      toast.error(
        error.response?.data?.message || "Failed to send password reset link.",
        {
          style: {
            backgroundColor: "var(--destructive)",
            color: "white",
          },
        }
      );
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="w-lg sm:max-w-lg p-4 mx-auto pt-30 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center mb-10">
        Mot de passe oublié ?
      </h1>
      <p className="text-center text-medium text-lg mb-6 text-gray-600">
        Entrez votre email pour recevoir un lien de réinitialisation de mot de
        passe.
      </p>

      {/* Email input */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Entrez votre email"
        className="w-[95%] p-4 text-lg border border-gray-300 rounded-md mt-1 mb-6"
      />

      {/* Validation error messages */}
      {errors.email && (
        <p className="text-red-500 text-sm text-center mb-4">
          {errors.email[0]}
        </p>
      )}

      {/* Submit button */}
      <Button
        onClick={handleForgotPassword}
        disabled={loading || !email} // Disabled if loading or email is empty
        className="w-[61%] py-6 px-8 bg-foreground/90 text-lg text-white"
      >
        {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
      </Button>
    </div>
  );
};

export default ForgotPasswordForm;
