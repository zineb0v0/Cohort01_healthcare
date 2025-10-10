// src/components/PatientComponents/layout/Layout.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import PatientSidebar from "./PatientSidebar.jsx";


export default function Layout() {

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <PatientSidebar />
      
    
      {/* Main content area */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
