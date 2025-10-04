import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./PatientComponents/Layout.jsx";
import AnalysePage from "./PatientComponents/Analyse_components/AnalysePage.jsx";
import Dashboard from "./TbibComponents/Dashboard.jsx";
import Sidebar from "./PatientComponents/PatientSidebar.jsx";
import CollaboratorLayout from "./TbibComponents/CollaboratorLayout.jsx";
import CollaboratorProfile from "./TbibComponents/CollaboratorProfile.jsx";
import RendezVousCollaborator from "./TbibComponents/RendezVousCollaborator.jsx";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AnalysePage />} />
        </Route>
          <Route path="/collaborator" element={<CollaboratorLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='/collaborator/profile' element={<CollaboratorProfile />} />
        <Route path='/collaborator/RendezVous' element={<RendezVousCollaborator />} />
      
        </Route>
      </Routes>
    </Router>
  );
}
