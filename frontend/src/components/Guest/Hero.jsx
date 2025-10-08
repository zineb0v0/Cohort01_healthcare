import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/authentication", { state: { mode: "register" } });
  };

  // Variants for content
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // Variants for background image
  const bgVariant = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  return (
    <div className="relative h-screen w-full">
      {/* Animated background image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('bg-herosection.png')" }}
        variants={bgVariant}
        initial="hidden"
        animate="visible"
        transition={{ duration: 1.5 }}
      ></motion.div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-start justify-center h-full text-left px-4 sm:px-6 md:px-10 lg:px-16 max-w-full md:max-w-4xl">
        {/* Heading */}
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue mb-4"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Votre compagnon de santé personnel
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          className="text-md  sm:text-lg md:text-xl lg:text-2xl text-blue mb-6 max-w-full md:max-w-2xl"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Prenez soin de vous en toute simplicité : gérez vos rendez-vous,
          suivez vos traitements et consultez vos analyses, le tout à portée de
          main.
        </motion.p>

        {/* Feature bullets */}
        <motion.div
          className="flex flex-wrap gap-4 sm:gap-6 pb-6 text-md text-blue"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="flex items-center gap-2 font-medium text-sm sm:text-base">
            <span className="text-red-700 text-lg sm:text-xl">●</span> OCR
            Analysis
          </span>
          <span className="flex items-center gap-2 font-medium text-sm sm:text-base">
            <span className="text-red-700 text-lg sm:text-xl">●</span> Smart
            Reminders
          </span>
          <span className="flex items-center gap-2 font-medium text-sm sm:text-base">
            <span className="text-red-700 text-lg sm:text-xl">●</span> AI
            Chatbot
          </span>
        </motion.div>

        {/* Button */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            className="modern-gradient px-6 py-4 sm:px-8 sm:py-6 flex items-center gap-2 text-white font-medium"
            onClick={handleClick}
          >
            <p className="text-sm sm:text-lg">Commencez dès maintenant</p>
            <img
              src="/flecheIcon.png"
              alt="fleche"
              className="w-4 h-2 sm:w-4 sm:h-2"
            />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// I want on desktop on hover to show a line with the same color of the text under the items in the navbar:import { useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import Logo from "../Logo";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const goToAuthentication = (mode) => {
//     navigate("/authentication", { state: { mode } });
//     setMobileOpen(false);
//   };

//   const handleScrollTo = (sectionId) => {
//     setMobileOpen(false); // Close mobile menu

//     if (sectionId === "Accueil") {
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       if (location.pathname !== "/") navigate("/");
//       return;
//     }

//     if (location.pathname !== "/") {
//       // Navigate home first, then scroll
//       navigate("/", { state: { scrollTo: sectionId } });
//       return;
//     }

//     // Scroll to the section if we are already on home
//     const section = document.getElementById(sectionId);
//     if (section) {
//       const y = section.getBoundingClientRect().top + window.scrollY - 64; // adjust for navbar
//       window.scrollTo({ top: y, behavior: "smooth" });
//     }
//   };

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 bg-white backdrop-blur-md shadow-md">
//       <div className="flex items-center justify-between px-6 py-4 md:px-10">
//         {/* Logo */}
//         <Logo />

//         {/* Desktop Menu */}
//         <div className="hidden md:flex flex-1 justify-center items-center space-x-10">
//           <a
//             onClick={() => handleScrollTo("Accueil")}
//             className="text-lg font-medium hover:text-[#2f7e9a] cursor-pointer"
//           >
//             Accueil
//           </a>
//           <a
//             onClick={() => handleScrollTo("Fonctionnalités")}
//             className="text-lg font-medium hover:text-[#2f7e9a] cursor-pointer"
//           >
//             Fonctionnalités
//           </a>
//           <a
//             onClick={() => handleScrollTo("about")}
//             className="text-lg font-medium hover:text-[#2f7e9a] cursor-pointer"
//           >
//             À propos
//           </a>
//           <a
//             onClick={() => {
//               navigate("/contact");
//               window.scrollTo({ top: 0, behavior: "smooth" }); // scrolls to top
//               setMobileOpen(false); // close mobile menu if open
//             }}
//             className="text-lg font-medium hover:text-[#2f7e9a] cursor-pointer"
//           >
//             Contact
//           </a>
//         </div>

//         {/* Desktop Buttons */}
//         <div className="hidden md:flex items-center space-x-3">
//           <Button
//             variant="outline"
//             className="transform transition-transform duration-300 hover:scale-103"
//             onClick={() => goToAuthentication("login")}
//           >
//             Se connecter
//           </Button>
//           <Button
//             className="bg-[#00345d]/96 text-white transform transition-transform duration-300 hover:scale-103 hover:bg-[#001f42]"
//             onClick={() => goToAuthentication("register")}
//           >
//             Rejoindre
//           </Button>
//         </div>

//         {/* Mobile Hamburger */}
//         <button
//           className="md:hidden flex flex-col justify-between w-6 h-6 cursor-pointer"
//           onClick={() => setMobileOpen(!mobileOpen)}
//         >
//           <span
//             className={`h-0.5 w-full bg-[#6cabc6] rounded transition-transform duration-300 ${
//               mobileOpen ? "rotate-45 translate-y-2" : ""
//             }`}
//           />
//           <span
//             className={`h-0.5 w-full bg-[#6cabc6] rounded transition-opacity duration-300 ${
//               mobileOpen ? "opacity-0" : ""
//             }`}
//           />
//           <span
//             className={`h-0.5 w-full bg-[#6cabc6] rounded transition-transform duration-300 ${
//               mobileOpen ? "-rotate-45 -translate-y-2" : ""
//             }`}
//           />
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="md:hidden flex flex-col items-center gap-4 px-6 py-4 bg-white shadow-md"
//           >
//             <a
//               onClick={() => handleScrollTo("Accueil")}
//               className="text-lg font-medium hover:text-[#2f7e9a] cursor-pointer"
//             >
//               Accueil
//             </a>
//             <a
//               onClick={() => handleScrollTo("Fonctionnalités")}
//               className="text-lg font-medium hover:text-[#2f7e9a] cursor-pointer"
//             >
//               Fonctionnalités
//             </a>
//             <a
//               onClick={() => handleScrollTo("about")}
//               className="text-lg font-medium hover:text-[#2f7e9a] cursor-pointer"
//             >
//               À propos
//             </a>
//             <a
//               onClick={() => navigate("/contact")}
//               className="text-lg font-medium hover:text-[#2f7e9a] cursor-pointer"
//             >
//               Contact
//             </a>

//             <Button
//               variant="outline"
//               className="transform transition-transform duration-300 hover:scale-103"
//               onClick={() => goToAuthentication("login")}
//             >
//               Se connecter
//             </Button>
//             <Button
//               className="bg-[#00345d]/96 text-white transform transition-transform duration-300 hover:scale-103 hover:bg-[#001f42]"
//               onClick={() => goToAuthentication("register")}
//             >
//               Rejoindre
//             </Button>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }
