<<<<<<<< HEAD:frontend/src/components/Collaborator/layout/CLayout.jsx

import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function CollaboratorLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 pt-16 lg:pl-64">
        <Outlet /> 
      </div>
    </div>
  );
}
========
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function CollaboratorLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 pt-16 lg:pl-64">
        <Outlet /> 
      </div>
    </div>
  );
}
>>>>>>>> origin/oumiamaAI:frontend/src/Components/Pages/CollaboratorComponent/Layout/CLayout.jsx
