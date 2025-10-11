import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./PatientComponents/Layout.jsx";
import AnalysePage from "./PatientComponents/Analyse_components/AnalysePage.jsx";
import Dashboard from "./Components/CollaboratorComponent/Dashboard/CDashboard.jsx";
import CollaboratorLayout from "./Components/CollaboratorComponent/Layout/CLayout.jsx";
import CollaboratorProfile from "./Components/CollaboratorComponent/Profile/CProfile.jsx";
import RendezVousCollaborator from "./Components/CollaboratorComponent/APPoinetements/CRendezVous.jsx";
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
