import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  // Navigating to Authentication page with the appropriate mode (register or login)
  const goToAuthentication = (mode) => {
    navigate("/authentication", { state: { mode } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <h1 className="text-4xl font-bold mb-6">Découvrez notre application et transformez votre expérience !</h1>
      <div className="flex space-x-4">
        <Button 
          onClick={() => goToAuthentication('register')} // Passing 'register' mode
          className="px-6 py-3 bg-blue-500 text-white text-xl"
        >
          S'inscrire
        </Button>
        <Button 
          onClick={() => goToAuthentication('login')} // Passing 'login' mode
          className="px-6 py-3 bg-blue-900 text-white text-xl"
        >
          Se connecter
        </Button>
      </div>
    </div>
  );
}

export default HomePage;
