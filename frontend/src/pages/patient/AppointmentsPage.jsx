import { useState, useEffect } from "react";
import api from "../../lib/axios.js";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

export default function BookAppointment() {
  const [collaborators, setCollaborators] = useState([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState("");
  const [type, setType] = useState("presentiel");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [patientId, setPatientId] = useState(null);
  const [loadingCollaborators, setLoadingCollaborators] = useState(true);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [notification, setNotification] = useState(null); // ✅ Nouvelle alerte
  const [error, setError] = useState("");

  // 📌 Récupération du patient
  useEffect(() => {
    setLoadingPatient(true);
    api
      .get("/api/me")
      .then((res) => {
        if (res.data?.patient?.id) setPatientId(res.data.patient.id);
        else setError("Impossible de récupérer les informations du patient.");
      })
      .catch(() => setError("Erreur lors du chargement du patient."))
      .finally(() => setLoadingPatient(false));
  }, []);

  // 📌 Récupération des collaborateurs
  useEffect(() => {
    setLoadingCollaborators(true);
    api
      .get("/api/collaborators/available")
      .then((res) => setCollaborators(res.data))
      .catch(() => setError("Erreur lors du chargement des médecins."))
      .finally(() => setLoadingCollaborators(false));
  }, []);

  // 📌 Gestion de la soumission
  const handleSubmit = () => {
    if (!selectedCollaborator || !date || !time) {
      showNotification("Veuillez remplir tous les champs.", "error");
      return;
    }

    const formattedTime = time.length === 5 ? `${time}:00` : time;

    api
      .post("/api/appointments", {
        patient_id: patientId,
        collaborator_id: selectedCollaborator,
        date,
        time: formattedTime,
        type,
      })
      .then(() =>
        showNotification("Rendez-vous réservé avec succès ! 🎉", "success")
      )
      .catch(() => showNotification("Erreur lors de la réservation.", "error"));
  };

  // 📌 Fonction pour afficher les notifications pro
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // disparaît après 3s
  };

  if (loadingPatient || loadingCollaborators)
    return (
      <p className="text-center text-gray-500 mt-20 text-lg">
        Chargement des données...
      </p>
    );

  if (error)
    return <p className="text-center text-red-500 mt-20">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-10 relative">
      {/* ✅ Notification animée */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg ${
              notification.type === "success"
                ? "bg-green-50 border border-green-300 text-green-700"
                : "bg-red-50 border border-red-300 text-red-700"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={22} className="text-green-600" />
            ) : (
              <XCircle size={22} className="text-red-600" />
            )}
            <p className="font-medium">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📋 Formulaire principal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-white shadow-xl rounded-3xl p-10 border border-blue-100"
      >
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8 tracking-tight">
          Réservation de Rendez-vous
        </h1>

        {/* Sélection médecin */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Médecin
          </label>
          <select
            value={selectedCollaborator}
            onChange={(e) => setSelectedCollaborator(e.target.value)}
            className="w-full border rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">-- Sélectionner un médecin --</option>
            {collaborators.length === 0 && (
              <option>Aucun collaborateur disponible</option>
            )}
            {collaborators.map((c) => (
              <option key={c.id} value={c.id}>
                {c.user?.profile?.first_name} {c.user?.profile?.last_name} —{" "}
                {c.speciality}
              </option>
            ))}
          </select>
        </div>

        {/* Type rendez-vous */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Type de rendez-vous
          </label>
          <div className="grid grid-cols-3 gap-3">
            {["presentiel", "appel", "appel_video"].map((option) => (
              <button
                key={option}
                onClick={() => setType(option)}
                className={`p-3 rounded-xl border text-sm font-medium transition ${
                  type === option
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white border-gray-300 hover:bg-blue-50"
                }`}
              >
                {option === "presentiel"
                  ? "Présentiel"
                  : option === "appel"
                  ? "Appel"
                  : "Vidéo"}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Heure */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Heure
            </label>
            <input
              type="time"
              value={time}
              step={1}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>
        </div>

        {/* Bouton */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!patientId || collaborators.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl shadow-md transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Confirmer le rendez-vous
        </motion.button>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Merci de votre confiance 💙
        </p>
      </motion.div>
    </div>
  );
}
