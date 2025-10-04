import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import AnalysePage from "./Analyse_components/AnalysePage.jsx";
import Dashboard from "./Analyse_components/AnalysePage.jsx";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AnalysePage />} />
        </Route>
      </Routes>
    </Router>
  );
}
