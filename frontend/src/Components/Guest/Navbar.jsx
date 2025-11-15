import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
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
    <nav className="fixed top-0 left-0 p-2 w-full z-50 bg-white backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between  lg:px-10">
        {/* Logo */}
        <img src="/logo1.webp" alt="Logo Echo" className="lg:h-16 h-14 " />

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center text-lg lg:text-xl items-center space-x-5 lg:space-x-10">
          <a
            onClick={() => handleScrollTo("Accueil")}
            className={`relative font-medium cursor-pointer
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
            className={`relative  font-medium cursor-pointer
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
            className={`relative  font-medium cursor-pointer
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
            className={`relative  font-medium cursor-pointer
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
        <div className="hidden md:flex items-center lg:space-x-3 space-x-1">
          <Button
            id="connexion"
            variant="outline"
            className="transform transition-transform py-2 px-2 lg:py-4 lg:px-5 text-md lg:text-base duration-300"
            onClick={() => goToAuthentication("login")}
          >
            Se connecter
          </Button>
          <Button
            className="modern-gradient-btn px-3 lg:px-6 py-2 lg:py-4 text-md lg:text-base text-white font-medium transition-transform duration-300"
            onClick={() => goToAuthentication("register")}
          >
            Rejoindre
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[#6cabc6] text-3xl focus:outline-none transition-transform duration-300"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
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
            className="md:hidden flex flex-col text-lg items-center gap-4 px-6 py-4 bg-white shadow-md"
          >
            <a
              onClick={() => handleScrollTo("Accueil")}
              className=" font-medium hover:text-[#2f7e9a] cursor-pointer"
            >
              Accueil
            </a>
            <a
              onClick={() => handleScrollTo("Fonctionnalités")}
              className=" font-medium hover:text-[#2f7e9a] cursor-pointer"
            >
              Fonctionnalités
            </a>
            <a
              onClick={() => handleScrollTo("about")}
              className=" font-medium hover:text-[#2f7e9a] cursor-pointer"
            >
              À propos
            </a>
            <a
              onClick={() => navigate("/contact")}
              className=" font-medium hover:text-[#2f7e9a] cursor-pointer"
            >
              Contact
            </a>

            <Button
              variant="outline"
              className="transform transition-transform w-full duration-300 text-lg hover:scale-103"
              onClick={() => goToAuthentication("login")}
            >
              Se connecter
            </Button>
            <Button
              className="bg-[#00345d]/96 text-white transform w-full text-lg transition-transform duration-300 hover:scale-103 hover:bg-[#001f42]"
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