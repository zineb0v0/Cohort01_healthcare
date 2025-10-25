import { useLocation } from "react-router-dom"; // To get the state from the location
import { useState, useEffect } from "react";
import RegisterForm from "../../Components/Auth/RegisterForm"
import LoginForm from "../../Components/Auth/LoginForm"
export default function AuthenticationPage() {
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(
    location.state?.mode === "register" ? true : false
  );
  const [active, setActive] = useState(
    location.state?.mode === "register" ? true : false
  );
  useEffect(() => {
    if (location.state?.mode === "login") {
      setIsRegister(false);
      setActive(false);
    } else if (location.state?.mode === "register") {
      setIsRegister(true);
      setActive(true);
    }
  }, [location.state]);

  const handleRegisterClick = () => {
    setIsRegister(true);
    setActive(true);
  };

  const handleLoginClick = () => {
    setIsRegister(false);
    setActive(false);
  };

  return (
    <div className={`auth-container ${active ? "active" : ""}`}>
      <div className="auth">
        {isRegister ? <RegisterForm /> : <LoginForm />}
      </div>

      <div className="toggle-container">
        <div className="toggle">
          <div
            className={`toggle-panel toggle-left ${
              isRegister ? "active" : ""
            } flex flex-col items-center justify-center relative`}
          >
            <h1 className="text-3xl md:text-4xl m-4 font-bold  ">
              Bienvenue dans votre parcours de santé !
            </h1>
            <p className="text-lg md:text-xl">
              Suivez votre bien-être et restez à jour avec vos objectifs de
              santé grâce à nous.
            </p>
            <button
              id="login"
              onClick={handleLoginClick}
              className="mt-10 py-2 px-4 border-2 border-blue-500 text-blue-500 rounded-md text-lg hover:bg-blue-900 hover:text-white transition-all"
            >
              Se connecter
            </button>
          </div>

          <div
            className={`toggle-panel toggle-right ${
              isRegister ? "active" : ""
            }`}
          >
            <h1 className="text-3xl md:text-4xl mb-14 font-bold">
              Prêt à commencer votre suivi bien-être !
            </h1>
            <p className="text-lg md:text-xl mt-4">
              Inscrivez-vous maintenant et obtenez des conseils personnalisés
              pour améliorer votre bien-être.
            </p>
            <button
              id="register"
              onClick={handleRegisterClick}
              className="mt-10 py-2 px-4 border-2 border-blue-500 text-blue-500 rounded-md text-lg hover:bg-[#002b80] hover:text-white transition-all"
            >
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
