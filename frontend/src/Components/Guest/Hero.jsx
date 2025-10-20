import { Button } from "../ui/button";
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
      <div className="relative mt-5 z-10 flex flex-col items-start justify-center h-full text-left px-4 sm:px-6 md:px-10 lg:px-16 max-w-full md:max-w-4xl">
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
          className="text-md font-base sm:text-lg md:text-xl lg:text-2xl text-blue mt-8 mb-10 max-w-full md:max-w-2xl"
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
          <span className="flex items-center gap-2 font-medium text-md sm:text-lg">
            <span className="text-red-700 text-lg sm:text-xl">●</span> OCR
            Analysis
          </span>
          <span className="flex items-center gap-2 font-medium text-md sm:text-lg">
            <span className="text-red-700 text-lg sm:text-xl">●</span> Smart
            Reminders
          </span>
          <span className="flex items-center gap-2 font-medium text-md sm:text-lg">
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
            className="modern-gradient px-6 py-4 sm:px-6  sm:py-6 flex items-center gap-2 text-white font-medium"
            onClick={handleClick}
          >
            <p className="text-md md:text-xl">Commencez dès maintenant</p>
            <img
              src="/flecheIcon.png"
              alt="fleche"
              className="w-4 h-3 md:w-5 h-4"
            />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
