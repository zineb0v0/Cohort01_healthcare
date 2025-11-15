import { Toaster } from "react-hot-toast"; 
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 

// === Layouts === 
import GuestLayout from "./Components/Guest/layout/GuestLayout.jsx"; 
import Layout from "./Components/PatientComponents/layout/Layout.jsx"; 
import CollaboratorLayout from "./Components/Collaborator/layout/CLayout.jsx"; 
Layout
// === Auth ===
import ProtectedRoute from "./Components/Auth/ProtectedRoute.jsx";

// === Guest Pages === 
import Home from "./pages/guest/Home.jsx"; 
import Contact from "./pages/guest/Contact.jsx"; 
import NotFound from "./pages/guest/NotFound.jsx"; 
import AuthenticationPage from "./pages/guest/AuthenticationPage.jsx"; 
import ForgotPasswordForm from "./pages/guest/ForgotPasswordForm.jsx"; 
import ResetPasswordForm from "./pages/guest/ResetPasswordForm.jsx";

// === Patient Pages === 
import ProfilePage from "./pages/patient/ProfilePage.jsx"; 
import AnalysePage from "./pages/patient/AnalysePage.jsx"; 
import DashboardP from "./pages/patient/Dashboard.jsx";
import BookAppointment from "./pages/patient/AppointmentsPage.jsx";

// === Collaborator Pages === 
import Dashboard from "./pages/collaborator/CDashbord.jsx";
import MedicationDashboard from "./pages/patient/MedicationDashboard.jsx";
import CollaboratorProfile from "./pages/collaborator/CProfile.jsx";
import RendezVousCollaborator from "./pages/collaborator/CRendezVous.jsx";

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
      <Toaster position="bottom-right" reverseOrder={false} /> 

      <Routes> 
        {/* === Guest Routes === */} 
        <Route element={<GuestLayout />}> 
          <Route path="/" element={<Home />} /> 
          <Route path="/contact" element={<Contact />} /> 
        </Route> 

        <Route path="/authentication" element={<AuthenticationPage />} /> 
        <Route path="/forgot-password" element={<ForgotPasswordForm />} /> 
        <Route path="/reset-password" element={<ResetPasswordForm />} /> 

        {/* === Patient Routes === */} 
        <Route
          path="/patient"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardP />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="medications" element={<MedicationDashboard pageName="Médicaments" />} />
          <Route path="appointments" element={<BookAppointment />} />
          {/* <Route path="settings" element={<ComingSoonPage pageName="Paramètres" />} /> */}
          <Route path="reports" element={<AnalysePage />} />
        </Route> 

        {/* === Collaborator Routes === */} 
        <Route
          path="/collaborator"
          element={
            <ProtectedRoute>
              <CollaboratorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<CollaboratorProfile />} />
          <Route path="RendezVous" element={<RendezVousCollaborator />} />
        </Route> 

        {/* Catch-all NotFound route */} 
        <Route path="*" element={<NotFound />} /> 
      </Routes> 
    </Router> 
  ); 
}