import { useEffect, useState } from "react";
import api from "../../lib/axios";
import { User, Edit, CheckCircle, Phone, MapPin, Calendar, Star, XCircle } from "lucide-react";

export default function CollaboratorProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [alert, setAlert] = useState({ message: "", type: "" }); // 🔹 Nouveau

  // 🔹 Afficher une alerte pendant 3 secondes
  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000);
  };

  // 🔹 Charger le profil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return setLoading(false);

        const res = await api.get("/api/collaborator/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data?.user || res.data; 
        if (!user) {
          setProfile(null);
          return;
        }

        const p = user.profile || {};
        const c = user.collaborator || {};

        const mergedProfile = {
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: p.first_name,
          last_name: p.last_name,
          phone: p.phone,
          address: p.address,
          date_birth: p.date_birth,
          gender: p.gender,
          emergency_contact: p.emergency_contact,
          speciality: c.speciality,
          licenseNumber: c.licenseNumber,
          workplace: c.workplace,
          isAvailable: !!c.isAvailable,
          availability: c.availability,
          rating: c.rating,
          updated_at: c.updated_at,
        };

        setProfile(mergedProfile);
        setFormData(mergedProfile);
      } catch (err) {
        console.error("Erreur lors du chargement du profil:", err);
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
      const token = localStorage.getItem("access_token");
      const res = await api.put("/api/collaborator/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data.user;
      const p = user.profile || {};
      const c = user.collaborator || {};

      const mergedProfile = {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: p.first_name,
        last_name: p.last_name,
        phone: p.phone,
        address: p.address,
        date_birth: p.date_birth,
        gender: p.gender,
        emergency_contact: p.emergency_contact,
        speciality: c.speciality,
        licenseNumber: c.licenseNumber,
        workplace: c.workplace,
        isAvailable: c.isAvailable,
        availability: c.availability,
        rating: c.rating,
        updated_at: c.updated_at,
      };

      setProfile(mergedProfile);
      setFormData(mergedProfile);
      setEditMode(false);
      showAlert("✅ Profil mis à jour avec succès !", "success");
    } catch (err) {
      console.error(err);
      showAlert("❌ Erreur lors de la mise à jour du profil.", "error");
    }
  };

  const toggleAvailability = async () => {
    try {
      const updatedStatus = !profile.isAvailable;
      setProfile({ ...profile, isAvailable: updatedStatus });
      setFormData({ ...formData, isAvailable: updatedStatus });

      const token = localStorage.getItem("token");
      await api.put(
        "/api/collaborator/profile",
        { ...formData, isAvailable: updatedStatus ? 1 : 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert(
        updatedStatus
          ? "🟢 Vous êtes maintenant disponible."
          : "🔴 Vous êtes maintenant occupé.",
        "success"
      );
    } catch (err) {
      console.error("Erreur lors du changement de disponibilité:", err);
      setProfile((prev) => ({ ...prev, isAvailable: !prev.isAvailable }));
      setFormData((prev) => ({ ...prev, isAvailable: !prev.isAvailable }));
      showAlert("⚠️ Une erreur est survenue.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-10 relative">
      {/* 🔹 Alerte personnalisée */}
      {alert.message && (
        <AlertMessage message={alert.message} type={alert.type} />
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center">
              <User className="text-blue-500" size={36} />
            </div>

            <div>
              {editMode ? (
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="text-2xl font-bold text-gray-800 border-b border-gray-300 focus:border-blue-500 outline-none"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">
                  {profile.first_name} {profile.last_name}
                </h2>
              )}
              <p className="text-gray-500 text-sm">Collaborateur médical</p>

              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  Spécialité: {profile.speciality || "—"}
                </span>

                <button
                  onClick={toggleAvailability}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                    profile.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <CheckCircle size={14} />
                  {profile.isAvailable ? "Disponible" : "Occupé"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 text-sm">
            <button
              onClick={() => {
                if (editMode) handleSave();
                else setEditMode(true);
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 font-medium"
            >
              <Edit size={18} />
              {editMode ? "Sauvegarder" : "Modifier"}
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 text-gray-700">
          <InfoCard
            icon={<Phone />}
            label="Téléphone"
            name="phone"
            value={formData.phone}
            editMode={editMode}
            onChange={handleChange}
          />
          <InfoCard
            icon={<MapPin />}
            label="Adresse"
            name="address"
            value={formData.address}
            editMode={editMode}
            onChange={handleChange}
          />
          <InfoCard
            icon={<Calendar />}
            label="Date de naissance"
            name="date_birth"
            type="date"
            value={formData.date_birth}
            editMode={editMode}
            onChange={handleChange}
          />
          <InfoCard
            icon={<User />}
            label="Genre"
            name="gender"
            value={formData.gender}
            editMode={editMode}
            onChange={handleChange}
          />
          <InfoCard
            icon={<User />}
            label="Lieu de travail"
            name="workplace"
            value={formData.workplace}
            editMode={editMode}
            onChange={handleChange}
          />
          <InfoCard
            icon={<Star />}
            label="Note"
            name="rating"
            value={formData.rating || "—"}
            editMode={false}
          />
        </div>

        {/* FOOTER */}
        <div className="text-sm text-gray-500 border-t border-gray-100 pt-4 mt-8 text-center">
          Dernière mise à jour :{" "}
          <span className="font-medium text-gray-700">
            {new Date(profile.updated_at).toLocaleString("fr-FR")}
          </span>
        </div>
      </div>
    </div>
  );
}

// 🔹 Alerte personnalisée
function AlertMessage({ message, type }) {
  const bgColor =
    type === "success"
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-red-100 text-red-800 border-red-300";

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-4 py-3 border rounded-lg shadow-md animate-fadeIn ${bgColor}`}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}

// 🔹 InfoCard
function InfoCard({ icon, label, value, name, editMode, onChange, type = "text" }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-2 text-blue-600 font-medium mb-2">
        {icon}
        <span>{label}</span>
      </div>
      {editMode ? (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      ) : (
        <p className="text-gray-800 font-semibold">{value || "—"}</p>
      )}
    </div>
  );
}
