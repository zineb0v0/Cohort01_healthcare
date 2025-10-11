import React from "react";
import { AlertCircle } from "lucide-react";

const MedicalConditions = ({ userData, isEditing }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertCircle className="text-gray-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Medical Information</h3>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Known Allergies
        </label>
        <input
          type="text"
          value={userData.allergies}
          disabled={!isEditing}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>
    </div>
  );
};

export default MedicalConditions;
