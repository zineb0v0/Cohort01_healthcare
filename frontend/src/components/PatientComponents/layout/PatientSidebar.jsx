// Sidebar.jsx
import { FaUser, FaCalendarAlt, FaPills, FaRobot, FaFileMedical, FaCog, FaSignOutAlt, FaHome } from "react-icons/fa";
import { NavLink } from "react-router-dom";


export default function Sidebar() {
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
          <NavLink
            to="/patient/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 rounded-lg font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <FaHome /> Tableau de bord
          </NavLink>

          <NavLink
            to="/patient/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 rounded-lg font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <FaUser /> Mon profil
          </NavLink>

          <NavLink
            to="/patient/appointments"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 rounded-lg font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <FaCalendarAlt /> Rendez-vous
          </NavLink>

          <NavLink
            to="/patient/medications"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 rounded-lg font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <FaPills /> Médicaments
          </NavLink>

          <NavLink
            to="/patient/assistant"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 rounded-lg font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <FaRobot /> Assistant IA
          </NavLink>

          <NavLink
            to="/patient/reports"
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 rounded-lg font-medium ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <FaFileMedical /> Rapports médicaux
          </NavLink>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t p-6 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?name=John+Doe"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-gray-800 font-medium">John Doe</p>
            <p className="text-sm text-gray-500">Patient</p>
          </div>
        </div>

        <NavLink
          to="/patient/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg font-medium ${
              isActive
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`
          }
        >
          <FaCog /> Paramètres
        </NavLink>

        <button
          onClick={() => alert("Déconnexion... (à connecter plus tard)")}
          className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg w-full text-left"
        >
          <FaSignOutAlt /> Déconnexion
        </button>
      </div>
    </div>
  );
}