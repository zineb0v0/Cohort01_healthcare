import { Card, CardContent } from "../../Components/ui/card";
import {
  ClipboardList,
  CalendarDays,
  Pill,
  Bot,
  Shield,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Pill,
    title: "Suivi des Médicaments",
    description: [
      "Ne manquez jamais une dose grâce aux rappels intelligents et à une gestion complète de vos médicaments.",
      "Suivez vos dosages, définissez des rappels personnalisés, surveillez les effets secondaires et conservez un historique complet de vos médicaments.",
    ],
  },
  {
    icon: ClipboardList,
    title: "Rapports Médicaux et Analyses",
    description: [
      "Stockez et analysez vos rapports médicaux en toute sécurité grâce à des analyses alimentées par l’IA.",
      "Téléchargez vos résultats d’analyses, radios et rapports, obtenez une analyse des tendances et des résumés de santé faciles à comprendre.",
    ],
  },
  {
    icon: CalendarDays,
    title: "Planification des Rendez-vous",
    description: [
      "Prenez et gérez vos rendez-vous avec les professionnels de santé en toute simplicité.",
      "Trouvez des médecins à proximité, prenez rendez-vous via le calendrier et recevez des rappels automatisés.",
    ],
  },
  {
    icon: Bot,
    title: "Assistant de santé IA",
    description: [
      "Obtenez des conseils de santé personnalisés et des réponses à vos questions médicales 24h/24 et 7j/7.",
      "Chatbot IA, entraîné sur des connaissances médicales, fournissant des conseils de santé préliminaires et un accompagnement.",
    ],
  },
  {
    icon: Shield,
    title: "Confidentialité et sécurité",
    description: [
      "Le chiffrement de niveau bancaire garantit que vos données de santé restent entièrement sécurisées.",
    ],
  },
  {
    icon: Clock,
    title: "Historique de santé",
    description: [
      "Visualisez votre parcours de santé grâce à une chronologie complète et au suivi de vos progrès.",
      "Suivez vos symptômes, surveillez vos signes vitaux et visualisez l’évolution de votre santé au fil du temps grâce à des graphiques interactifs.",
    ],
  },
];

export default function Services() {
  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 px-6 bg-white" id="Fonctionnalités">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0F1D3B] mb-12">
        Fonctionnalités
      </h2>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={index}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="h-full"
            >
              <Card className="h-full flex flex-col shadow-md bg-white border border-gray-300 hover:shadow-xl hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#0F1D3B] mb-2">
                    {service.title}
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 flex-1">
                    {service.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
