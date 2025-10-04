import { useEffect, useState } from "react";
import { FaSignOutAlt, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios.js";

export default function Sidebar() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // 🔸 جلب معلومات الطبيب
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // تأكدي أنه كيتسجل عند login
        const res = await api.get("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement du profil:", err);
      }
    };

    fetchProfile();
  }, []);

  // 🔸 Déconnexion
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    }
  };

  return (
    <div className="h-screen w-64 bg-white shadow-lg flex flex-col justify-between overflow-y-auto">
      {/* Logo */}
      <div>
        <div className="p-5 ">
          <img
            src="/logo1.webp"
            alt="Logo Echo"
            className="h-20 w-[200px]"
          />
        </div>

        {/* Navigation */}
        <nav className="mt-2 space-y-2">
          <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
            <FaHome /> Tableau de bord
          </a>
          <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
            📅 Rendez-vous
          </a>
          <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
            👥 Patients
          </a>
          <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
            ⚙️ Profil
          </a>
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="border-t p-6 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${profile?.first_name}+${profile?.last_name}`}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-gray-800 font-medium">
              {profile ? `${profile.first_name} ${profile.last_name}` : "Chargement..."}
            </p>
            <p className="text-sm text-gray-500">Collaborateur</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg w-full text-left"
        >
          <FaSignOutAlt /> Déconnexion
        </button>
      </div>
    </div>
  );
}
