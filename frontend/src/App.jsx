// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// === Patient Components ===
import Layout from "./components/PatientComponents/layout/Layout.jsx";
import ProfilePage from "./pages/patient/ProfilePage.jsx";
import AnalysePage from "./components/PatientComponents/Analyse_components/AnalysePage.jsx";
// === Collaborator Components ===
import Dashboard from "./components/Collaborator/CDashboard.jsx";
import CollaboratorLayout from "./components/Collaborator/layout/CLayout.jsx";
import CollaboratorProfile from "./components/Collaborator/CProfile.jsx";
import RendezVousCollaborator from "./components/Collaborator/CRendezVous.jsx";

// Temporary placeholder for pages not yet developed
const ComingSoonPage = ({ pageName }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-600 mb-2">{pageName}</h2>
      <p className="text-gray-500">Page en cours de développement</p>
    </div>
  </div>
);


export default function App() {
  return (
    <Router>
      <Routes>
        {/* === Patient Routes === */}
        <Route path="/patient" element={<Layout />}>
          {/* Default route inside Layout */}
          <Route index element={<Navigate to="profile" replace />} />

          {/* Patient pages */}
          <Route path="profile" element={<ProfilePage />} />
          <Route path="dashboard" element={<ComingSoonPage pageName="Tableau de Bord" />} />
          <Route path="medications" element={<ComingSoonPage pageName="Médicaments" />} />
          <Route path="appointments" element={<ComingSoonPage pageName="Rendez-vous" />} />
          <Route path="settings" element={<ComingSoonPage pageName="Paramètres" />} />
          <Route path="reports" element={<ComingSoonPage pageName="Rapports" />} />
        </Route>

        {/* Default redirect if someone opens "/" */}
        <Route path="/" element={<Navigate to="/patient/profile" replace />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<AnalysePage />} />
        </Route>
        
        {/* === Collaborator Routes === */}
          <Route path="/collaborator" element={<CollaboratorLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='/collaborator/profile' element={<CollaboratorProfile />} />
          <Route path='/collaborator/RendezVous' element={<RendezVousCollaborator />} />
        </Route>

      </Routes>
    </Router>
  );
}
