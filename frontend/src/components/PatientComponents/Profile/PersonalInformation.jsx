import React from "react";
import { User } from "lucide-react";

const PersonalInformation = ({ userData, isEditing, onChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="text-gray-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {[
          { label: "Full Name", value: userData.name, type: "text", name: "name" },
          { label: "Email Address", value: userData.email, type: "email", name: "email" },
          { label: "Phone Number", value: userData.phone, type: "tel", name: "phone" },
          { label: "Date of Birth", value: userData.dateBirth, type: "text", name: "dateBirth" },
          { label: "Address", value: userData.address, type: "text", name: "address", full: true },
          { label: "Emergency Contact", value: userData.emergencyContact, type: "text", name: "emergencyContact", full: true },
        ].map((field, index) => (
          <div key={index} className={field.full ? "col-span-2" : ""}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={field.value || ""}
              disabled={!isEditing}
              onChange={onChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInformation;