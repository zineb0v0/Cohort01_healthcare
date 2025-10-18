import { useEffect, useState } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaPills,
  FaFileMedical,
  FaCog,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../../lib/axios";

export default function PatientSidebar() {
  const [profile, setProfile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Charger le profil du patient
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
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

  // Déconnexion
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await api.post(
        "/api/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("access_token");
      navigate("/login");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    }
  };

  return (
    <>
      {/* 🔹 Barre supérieure mobile */}
      <div className="lg:hidden flex items-center justify-between bg-white shadow-md p-4 fixed top-0 left-0 right-0 z-50">
        <img src="/logo1.webp" alt="Logo" className="h-10" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-600 text-2xl focus:outline-none"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* 🔹 Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-200 flex justify-center lg:justify-start">
          <img src="/logo1.webp" alt="Logo Echo" className="h-16" />
        </div>

        {/* Navigation */}
        <nav className="mt-2 space-y-2">
          <SidebarLink to="/patient/dashboard" icon={<FaHome />} label="Tableau de bord" />
          <SidebarLink to="/patient/profile" icon={<FaUser />} label="Mon profil" />
          <SidebarLink to="/patient/appointments" icon={<FaCalendarAlt />} label="Rendez-vous" />
          <SidebarLink to="/patient/medications" icon={<FaPills />} label="Médicaments" />
          <SidebarLink to="/patient/reports" icon={<FaFileMedical />} label="Rapports médicaux" />
        </nav>

        {/* Infos utilisateur + Déconnexion */}
        <div className="border-t p-5">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={`https://ui-avatars.com/api/?name=${
                profile?.first_name || "User"
              }+${profile?.last_name || ""}&background=007bff&color=fff`}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border"
            />
            <div>
              <p className="text-gray-800 font-medium">
                {profile
                  ? `${profile.first_name} ${profile.last_name}`
                  : "Chargement..."}
              </p>
              <p className="text-sm text-gray-500">Patient</p>
            </div>
          </div>

          <NavLink
            to="/patient/settings"
            className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg w-full text-left mb-2"
          >
            <FaCog /> Paramètres
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg w-full text-left"
          >
            <FaSignOutAlt /> Déconnexion
          </button>
        </div>
      </div>

      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

/* 🔸 Sous-composant pour liens */
function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-6 py-3 rounded-lg mx-3 transition-all ${
          isActive
            ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
