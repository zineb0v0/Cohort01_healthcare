import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Mes données de santé sont-elles sécurisées et confidentielles ?",
    answer:
      "Oui. Toutes vos informations médicales sont stockées de manière chiffrée et respectent les normes de confidentialité internationales.",
  },
  {
    question: "Comment suivre mes médicaments et mes doses quotidiennes ?",
    answer:
      "Vous saisissez vos médicaments et horaires, et l’application vous envoie des rappels à l’heure de chaque prise ainsi que des alertes en cas d’oubli, pour un suivi fiable de vos traitements.",
  },
  {
    question: "Un support client est-il disponible ?",
    answer:
      "Oui, notre équipe de support est disponible 7j/7 pour répondre à toutes vos questions et vous assister en cas de besoin.",
  },
  {
    question: "Est-ce que je peux consulter mes rapports médicaux précédents ?",
    answer:
      "Bien sûr. Vous pouvez accéder à l’historique de vos rapports médicaux à tout moment depuis votre espace personnel sécurisé.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="bg-gray-50 py-16" id="faq">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-10"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          Questions fréquentes
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white shadow-sm rounded-lg p-4 text-left cursor-pointer transition-all hover:shadow-md"
              onClick={() => toggleFaq(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                <ChevronDown
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </div>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.p
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-3 text-gray-600 overflow-hidden"
                  >
                    {faq.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
