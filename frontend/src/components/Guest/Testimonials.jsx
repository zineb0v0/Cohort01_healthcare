import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Testimonials() {
const testimonials = [
  {
    text: "Cette application a transformé ma manière de gérer mon diabète. Les rappels de médicaments et le suivi de la glycémie m'ont aidé à mieux contrôler ma condition.",
    name: "Salwa Kassimi",
    role: "Patiente atteinte de maladie chronique",
  },
  {
    text: "Je recommande Healthcare Companion à tous mes patients. Les dossiers de santé complets et la planification des rendez-vous rendent nos consultations plus efficaces.",
    name: "Dr. Karim Alaoui",
    role: "Médecin généraliste",
  },
  {
    text: "En tant que personne jonglant entre le travail et la famille, cette application me permet de suivre les besoins de santé de chacun. L’assistant IA est extrêmement utile.",
    name: "Meryem Radi",
    role: "Professionnelle active",
  },
  {
    text: "Assez simple pour que quelqu’un de mon âge puisse l’utiliser, mais suffisamment puissante pour gérer tous mes médicaments et rendez-vous. Le support client est exceptionnel.",
    name: "Sami Berrada",
    role: "Senior",
  },
];


  const stats = [
    { number: "10,000+", label: "Utilisateurs actifs" },
    { number: "100%", label: "Temps de disponibilité" },
    { number: "4.9/5", label: "Évaluation des utilisateurs" },
    { number: "100+", label: "Partenaires de santé" },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 bg-white px-6" id="testimonials">
      <motion.h3
        className="text-2xl md:text-3xl font-bold text-center text-[#0F1D3B] mb-10"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        Approuvé par milliers
      </motion.h3>

      {/* Témoignages */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <Card className="border bg-white border-gray-200 shadow-lg hover:shadow-lg transition">
              <CardContent className="p-6 space-y-4">
                <img src="/cotesIcon.png" alt="cotes" className="w-6.5 h-7" />
                <p className="text-gray-700 text-sm leading-relaxed">
                  “{t.text}”
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <img
                    src="userIcon1.png"
                    alt={t.name}
                    className="w-10 h-10"
                  />
                  <div>
                    <p className="font-semibold text-[#0F1D3B]">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <div className="text-yellow-400 text-2xl">★★★★★</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mt-16 max-w-5xl mx-auto">
        {stats.map((s, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <h4 className="text-2xl font-bold text-[#0F1D3B]">{s.number}</h4>
            <p className="text-gray-600 text-sm">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
