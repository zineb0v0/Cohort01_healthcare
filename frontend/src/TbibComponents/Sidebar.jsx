import { useEffect, useState } from "react";
import { FaSignOutAlt, FaHome, FaCalendarAlt, FaUser } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../lib/axios.js";

export default function Sidebar() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // 🔹 Charger le profil du collaborateur
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement du profil:", err);
      }
    };
    fetchProfile();
  }, []);

  // 🔹 Déconnexion
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/api/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    }
  };

  return (
    <div className="h-screen w-64 bg-white shadow-lg flex flex-col justify-between overflow-y-auto">
      {/* 🔹 Logo */}
      <div>
        <div className="p-5">
          <img src="/logo1.webp" alt="Logo Echo" className="h-20 w-[200px]" />
        </div>

        {/* 🔹 Navigation */}
        <nav className="mt-2 space-y-2">
          <NavLink
            to="/collaborator"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 rounded-lg ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <FaHome /> Tableau de bord
          </NavLink>

          <NavLink
            to="/collaborator/rendezvous"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 rounded-lg ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <FaCalendarAlt /> Rendez-vous
          </NavLink>

          <NavLink
            to="/collaborator/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 rounded-lg ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <FaUser /> Profil
          </NavLink>
        </nav>
      </div>

      {/* 🔹 Informations utilisateur + Déconnexion */}
      <div className="border-t p-6 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={`https://ui-avatars.com/api/?name=${profile?.first_name || "User"}+${profile?.last_name || ""}`}
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
