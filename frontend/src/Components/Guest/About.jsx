import { Phone, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function About() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      id="about"
      className="bg-[#F3F7FF] py-16 px-6 text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.8 }}
      variants={fadeInUp}
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold text-[#0F1D3B] mb-4"
        variants={fadeInUp}
        transition={{ duration: 0.8 }}
      >
        À propos
      </motion.h2>

      <motion.p
        className="max-w-3xl mx-auto text-gray-600 leading-relaxed"
        variants={fadeInUp}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Echo simplifie la gestion de votre santé. Grâce à une interface
        intuitive, gérez vos rendez-vous, médicaments, analyses et interagissez
        avec notre chatbot IA pour des conseils santé personnalisés. L’IA
        analyse vos données et vous aide à mieux suivre votre santé, tout en
        offrant aux prestataires de soins une gestion sécurisée et connectée.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8"
        variants={fadeInUp}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
         <Link
          to="/contact"
          className="bg-[#001f42]/94 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:scale-105 hover:bg-[#001f42] transition"
        >
          Contactez-nous <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-3 text-[#0F1D3B]">
          <Phone className="w-5 h-5" />
          <div className="text-sm text-left">
            <p className="font-semibold">Obtenir de l’aide</p>
            <p className="text-gray-600">+212389922189</p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
