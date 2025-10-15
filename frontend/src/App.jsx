import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Components/Pages/PatientComponents/Layout.jsx";
import AnalysePage from "./Components/Pages/PatientComponents/Analyse_components/AnalysePage.jsx";
import Dashboard from "./Components/Pages/CollaboratorComponent/Dashboard/CDashboard.jsx";
import CollaboratorLayout from "./Components/Pages/CollaboratorComponent/Layout/CLayout.jsx";
import CollaboratorProfile from "./Components/Pages/CollaboratorComponent/Profile/CProfile.jsx";
import RendezVousCollaborator from "./Components/Pages/CollaboratorComponent/APPoinetements/CRendezVous.jsx";
import BookAppointment from "./Components/Pages/PatientComponents/BookAppointment.jsx";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AnalysePage />} />
          <Route path="/bookappointment" element={<BookAppointment />} />
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
