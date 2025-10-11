// Layout.jsx
import React from "react";
import Sidebar from "./PatientSidebar.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixe */}
      <Sidebar />

      {/* Contenu principal qui change selon la route */}
      <main className="flex-1 bg-[#F8FBFE] p-2  overflow-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
