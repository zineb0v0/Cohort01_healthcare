import React from "react";
import { Activity } from "lucide-react";

const AccountActivity = ({ accountStats }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="text-blue-600" size={30} />
        <h3 className="text-lg font-semibold text-gray-800">Account Activity</h3>
      </div>

      <div className="space-y-4">
        {accountStats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{stat.label}</span>
            <span className="text-sm font-semibold text-gray-800">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountActivity;
