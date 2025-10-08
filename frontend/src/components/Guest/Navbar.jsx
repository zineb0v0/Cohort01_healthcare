import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Logo from "../Logo";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Accueil");

  const goToAuthentication = (mode) => {
    navigate("/authentication", { state: { mode } });
    setMobileOpen(false);
  };

  const handleScrollTo = (sectionId) => {
    setMobileOpen(false); // close mobile menu
    setActiveSection(sectionId); // mark as active

    // Handle "Accueil" (scroll to top)
    if (sectionId === "Accueil") {
      // Removing any hash from URL so browser doesn't try to jump to a section
      if (location.hash) {
        window.history.replaceState(null, "", "/");
      }

      // Scroll smoothly to top
      window.scrollTo({ top: 0, behavior: "smooth" });

      // If not on home page, navigate there
      if (location.pathname !== "/") {
        navigate("/");
      }

      return;
    }

    // For other sections
    if (location.pathname !== "/") {
      // Navigate home with hash
      navigate(`/#${sectionId}`);
      return;
    }

    // Already on home, scroll to the section
    const section = document.getElementById(sectionId);
    if (section) {
      const y = section.getBoundingClientRect().top + window.scrollY - 64; // adjust for navbar
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between px-6 py-4 md:px-10">
        {/* Logo */}
        <Logo />

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center items-center space-x-10">
          <a
            onClick={() => handleScrollTo("Accueil")}
            className={`relative text-lg font-medium cursor-pointer
    ${activeSection === "Accueil" ? "text-[#2f7e9a]" : "text-gray-800"} 
    hover:text-[#2f7e9a]
    after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-[#2f7e9a] 
    after:transition-all after:duration-300
    hover:after:w-full
    ${activeSection === "Accueil" ? "after:w-full" : "after:w-0"}`}
          >
            Accueil
          </a>

          <a
            onClick={() => handleScrollTo("Fonctionnalités")}
            className={`relative text-lg font-medium cursor-pointer
    ${activeSection === "Fonctionnalités" ? "text-[#2f7e9a]" : "text-gray-800"} 
    hover:text-[#2f7e9a]
    after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-[#2f7e9a] 
    after:transition-all after:duration-300
    hover:after:w-full
    ${activeSection === "Fonctionnalités" ? "after:w-full" : "after:w-0"}`}
          >
            Fonctionnalités
          </a>

          <a
            onClick={() => handleScrollTo("about")}
            className={`relative text-lg font-medium cursor-pointer
    ${activeSection === "about" ? "text-[#2f7e9a]" : "text-gray-800"} 
    hover:text-[#2f7e9a]
    after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-[#2f7e9a] 
    after:transition-all after:duration-300
    hover:after:w-full
    ${activeSection === "about" ? "after:w-full" : "after:w-0"}`}
          >
            À propos
          </a>

          <a
            onClick={() => {
              setMobileOpen(false);
              navigate("/contact");
              setActiveSection("Contact");
            }}
            className={`relative text-lg font-medium cursor-pointer
    ${activeSection === "Contact" ? "text-[#2f7e9a]" : "text-gray-800"} 
    hover:text-[#2f7e9a]
    after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-[#2f7e9a] 
    after:transition-all after:duration-300
    hover:after:w-full
    ${activeSection === "Contact" ? "after:w-full" : "after:w-0"}`}
          >
            Contact
          </a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button
            id="connexion"
            variant="outline"
            className="transform transition-transform duration-300 "
            onClick={() => goToAuthentication("login")}
          >
            Se connecter
          </Button>
          <Button
            className="modern-gradient-btn px-6 py-3 sm:px-8 sm:py-4 text-white font-medium transition-transform duration-300"
            onClick={() => goToAuthentication("register")}
          >
            Rejoindre
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col justify-between w-6 h-6 cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span
            className={`h-0.5 w-full bg-[#6cabc6] rounded transition-transform duration-300 ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full bg-[#6cabc6] rounded transition-opacity duration-300 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-full bg-[#6cabc6] rounded transition-transform duration-300 ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col items-center gap-4 px-6 py-4 bg-white shadow-md"
          >
            <a
              onClick={() => handleScrollTo("Accueil")}
              className="text-lg font-medium hover:text-[#2f7e9a] cursor-pointer"
            >
              Accueil
            </a>
            <a
              onClick={() => handleScrollTo("Fonctionnalités")}
              className="text-lg font-medium hover:text-[#2f7e9a] cursor-pointer"
            >
              Fonctionnalités
            </a>
            <a
              onClick={() => handleScrollTo("about")}
              className="text-lg font-medium hover:text-[#2f7e9a] cursor-pointer"
            >
              À propos
            </a>
            <a
              onClick={() => navigate("/contact")}
              className="text-lg font-medium hover:text-[#2f7e9a] cursor-pointer"
            >
              Contact
            </a>

            <Button
              variant="outline"
              className="transform transition-transform duration-300 hover:scale-103"
              onClick={() => goToAuthentication("login")}
            >
              Se connecter
            </Button>
            <Button
              className="bg-[#00345d]/96 text-white transform transition-transform duration-300 hover:scale-103 hover:bg-[#001f42]"
              onClick={() => goToAuthentication("register")}
            >
              Rejoindre
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
