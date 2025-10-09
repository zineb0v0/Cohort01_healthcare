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
  FaStar,
} from "react-icons/fa";

export default function CollaboratorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // 🔹 Charger le profil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setLoading(false);

        const res = await api.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data);
        setFormData({
          first_name: res.data.first_name || "",
          last_name: res.data.last_name || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          date_birth: res.data.date_birth ? res.data.date_birth.split("T")[0] : "",
          gender: res.data.gender || "",
          speciality: res.data.speciality || "",
          licenseNumber: res.data.licenseNumber || "",
          workplace: res.data.workplace || "",
          isAvailable: res.data.isAvailable ?? false,
          availability: res.data.availability || "",
          rating: res.data.rating ?? 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg font-medium">
        ⏳ Chargement du profil...
      </div>
    );

  if (!profile)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg font-medium">
        ⚠️ Impossible de charger le profil.
      </div>
    );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.put("/api/collaborator/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profil mis à jour avec succès !");
      setProfile(res.data.profile);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du profil !");
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 md:px-8 bg-gray-50">
      {/* HEADER */}
      <div className="max-w-4xl mx-auto relative">
        <div className="h-32 bg-blue-500 rounded-t-xl"></div>
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <img
            src={`https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}&background=007bff&color=fff&bold=true`}
            alt="Avatar"
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
          />
        </div>
      </div>

      {/* INFO PRINCIPALE */}
      <div className="max-w-4xl mx-auto mt-16 text-center">
        {editMode ? (
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 text-center"
          />
        ) : (
          <h2 className="text-2xl font-semibold text-gray-800">
            {profile.first_name} {profile.last_name}
          </h2>
        )}
        <p className="text-blue-600 font-medium">Collaborateur médical</p>
        <p className="text-gray-500 text-sm mt-1">
          Créé le{" "}
          <span className="font-semibold">
            {new Date(profile.created_at).toLocaleDateString("fr-FR")}
          </span>
        </p>
      </div>


      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 text-gray-700">
        <EditableCard icon={<FaPhone />} label="Téléphone" name="phone" value={formData.phone} editMode={editMode} onChange={handleChange} />
        <EditableCard icon={<FaMapMarkerAlt />} label="Adresse" name="address" value={formData.address} editMode={editMode} onChange={handleChange} />
        <EditableCard icon={<FaBirthdayCake />} label="Date de naissance" name="date_birth" type="date" value={formData.date_birth} editMode={editMode} onChange={handleChange} />
        <EditableCard icon={<FaTransgender />} label="Genre" name="gender" value={formData.gender} editMode={editMode} onChange={handleChange} />
        <EditableCard icon={<FaClock />} label="Disponibilité" name="availability" value={formData.availability} editMode={editMode} onChange={handleChange} />
        <EditableCard icon={<FaExclamationTriangle />} label="Disponible" name="isAvailable" type="checkbox" value={formData.isAvailable} editMode={editMode} onChange={handleChange} />
        <EditableCard icon={<FaUser />} label="Spécialité" name="speciality" value={formData.speciality} editMode={editMode} onChange={handleChange} />
        <EditableCard icon={<FaUser />} label="Numéro de licence" name="licenseNumber" value={formData.licenseNumber} editMode={editMode} onChange={handleChange} />
        <EditableCard icon={<FaUser />} label="Lieu de travail" name="workplace" value={formData.workplace} editMode={editMode} onChange={handleChange} />
        <EditableCard icon={<FaStar />} label="Note" name="rating" value={formData.rating} editMode={false} />
      </div>

      {/* BOUTONS EDIT / SAVE */}
      <div className="flex justify-center gap-4 mt-6">
        {editMode ? (
          <>
            <button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
              💾 Sauvegarder
            </button>
            <button onClick={() => setEditMode(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg">
              Annuler
            </button>
          </>
        ) : (
          <button onClick={() => setEditMode(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            ✏️ Modifier
          </button>
        )}
      </div>

      {/* FOOTER */}
      <div className="max-w-4xl mx-auto bg-blue-50 border-t border-blue-100 py-3 text-center text-sm text-blue-700 mt-8 rounded-b-xl">
        <FaCalendarAlt className="inline-block mr-1" />
        Dernière mise à jour :{" "}
        <span className="font-medium">{new Date(profile.updated_at).toLocaleString("fr-FR")}</span>
      </div>
    </div>
  );
}

// Composant EditableCard
function EditableCard({ icon, label, value, name, editMode, onChange, type = "text" }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:bg-blue-50 transition-all duration-200">
      <div className="flex items-center gap-2 text-blue-600 font-medium mb-1">
        {icon}
        <span>{label}</span>
      </div>
      {editMode && type !== "checkbox" ? (
        <input type={type} name={name} value={value} onChange={onChange} className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      ) : type === "checkbox" && editMode ? (
        <input type="checkbox" name={name} checked={value} onChange={onChange} className="h-5 w-5" />
      ) : (
        <p className="text-gray-800 font-semibold">{value ?? "—"}</p>
      )}
    </div>
  );
}
