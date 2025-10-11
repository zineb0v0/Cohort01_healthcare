import React from "react";
import { User, Edit, LogOut, CheckCircle } from "lucide-react";

const ProfileSection = ({ userData, isEditing,formData, setIsEditing , updateProfile, logout}) => { 
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
      {/* Left side - user info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center">
          <User className="text-blue-500" size={36} />
        </div>

        {/* User info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {userData.name || "John Doe"}
          </h2>
          <p className="text-gray-500 text-sm">
            {userData.email || "patient@demo.com"}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Patient
            </span>
            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              <CheckCircle size={14} /> Verified
            </span>
          </div>
        </div>
      </div>

      {/* Right side - buttons */}
      <div className="flex gap-2 mt-4 md:mt-0 text-sm">
        <button
        onClick={() => {
          if (isEditing) {
            updateProfile(formData); // now formData is passed from parent
          }
          setIsEditing(!isEditing);
        }}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 font-medium"
      >
        <Edit size={18} />
        {isEditing ? "Save Profile" : "Edit Profile"}
      </button>

        <button
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 font-medium"
        >
          <LogOut size={12} />
          Loggout
        </button>
        
      </div>
    </div>
  );
};

export default ProfileSection;
