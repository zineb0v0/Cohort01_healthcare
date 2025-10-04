import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./PatientComponents/Layout.jsx";
import AnalysePage from "./Analyse_components/AnalysePage.jsx";
import Dashboard from "./TbibComponents/Dashboard.jsx";
import Sidebar from "./PatientComponents/PatientSidebar.jsx";
import CollaboratorLayout from "./TbibComponents/CollaboratorLayout.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AnalysePage />} />
         

        </Route>
          <Route path="/collaborator" element={<CollaboratorLayout />}>
          <Route index element={<Dashboard />} />
         

        </Route>
      </Routes>
    </Router>
  );
}
