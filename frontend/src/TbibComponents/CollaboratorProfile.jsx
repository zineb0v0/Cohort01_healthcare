import { useEffect, useState } from "react";
import api from "../lib/axios";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaTransgender,
  FaClock,
  FaExclamationTriangle,
  FaCalendarAlt,
} from "react-icons/fa";

export default function CollaboratorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ Aucun token trouvé dans le localStorage");
          setLoading(false);
          return;
        }

        const res = await api.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(res.data);
      } catch (err) {
        console.error("❌ Erreur lors du chargement du profil :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg">
        ⏳ Chargement des informations...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg">
        ⚠️ Impossible de charger le profil.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-3">
      {/* 🔹 En-tête */}
    
      {/* 🔹 Carte de profil */}
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg shadow-xl border border-blue-100 rounded-3xl p-8 transition-all hover:shadow-2xl">
        {/* Header du profil */}
        <div className="flex items-center gap-6 border-b border-blue-100 pb-6">
          <img
                src={`https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}&background=007bff&color=fff&bold=true`}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-md"
          />
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {profile.first_name} {profile.last_name}
            </h3>
            <p className="text-blue-600 font-medium">Collaborateur</p>
            <p className="text-sm text-gray-500 mt-1">
              Créé le{" "}
              <span className="font-semibold">
                {new Date(profile.created_at).toLocaleDateString("fr-FR")}
              </span>
            </p>
          </div>
        </div>

        {/* 🔹 Informations principales */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-8 text-gray-700">
          <InfoCard icon={<FaPhone />} label="Téléphone" value={profile.phone || "—"} />
          <InfoCard icon={<FaMapMarkerAlt />} label="Adresse" value={profile.address || "—"} />
          <InfoCard
            icon={<FaBirthdayCake />}
            label="Date de naissance"
            value={
              profile.date_birth
                ? new Date(profile.date_birth).toLocaleDateString("fr-FR")
                : "—"
            }
          />
          <InfoCard icon={<FaTransgender />} label="Genre" value={profile.gender} />
          <InfoCard icon={<FaClock />} label="Disponibilité" value="7j/7 - 24h/24" />
          <InfoCard
            icon={<FaExclamationTriangle />}
            label="Contact d’urgence"
            value={profile.emergency_contact || "—"}
          />
        </div>

        {/* 🔹 Bas de carte */}
        <div className="mt-10 flex items-center justify-center gap-2 text-blue-700 text-sm">
          <FaCalendarAlt />
          <p>Dernière mise à jour : {new Date(profile.updated_at).toLocaleString("fr-FR")}</p>
        </div>
      </div>
    </div>
  );
}

/* 🔸 Sous-composant pour afficher les infos joliment */
function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 hover:bg-blue-100 transition-all duration-200">
      <div className="flex items-center gap-2 text-blue-700 font-semibold mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
  );
}
