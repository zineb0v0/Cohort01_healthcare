// Sidebar.jsx
import { FaUser, FaCalendarAlt, FaPills, FaRobot, FaFileMedical, FaCog, FaSignOutAlt, FaHome } from "react-icons/fa";

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
      <div className="border-t p-6 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?name=John+Doe"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-gray-800 font-medium">John Doe</p>
            <p className="text-sm text-gray-500">Collaborator</p>
          </div>
        </div>

        <a href="#" className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg">
          <FaCog /> Paramètres
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-100 rounded-lg">
          <FaSignOutAlt /> Déconnexion
        </a>
      </div>
    </div>
  );
}
