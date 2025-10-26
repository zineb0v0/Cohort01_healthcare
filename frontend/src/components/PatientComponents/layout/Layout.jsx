// src/components/PatientComponents/layout/Layout.jsx
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";


export default function Layout() {

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <PatientSidebar />
      
    
      {/* Main content area */}
      <main className="flex-1 p-4  pt-15 lg:pl-64">
        <Outlet />
      </main>
    </div>
  );
}
