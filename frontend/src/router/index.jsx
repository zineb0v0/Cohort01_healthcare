import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";

import Users from "../pages/Users";
import GuestLayout from "../layouts/GuestLayout";
import NotFound from "../pages/NotFound";
import DashboardPatient from "@/pages/DashboardPatient";
import DashboardCollaborator from "@/pages/DashboardCollaborator";
import PatientLayout from "@/layouts/PatientLayout";
import CollaboratorLayout from "@/layouts/CollaboratorLayout";
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";
import ResetPasswordForm from "@/components/Auth/ResetPasswordForm";
import AuthenticationPage from "@/pages/AuthenticationPage";
import Contact from "@/pages/Contact";
export const router = createBrowserRouter([
  {
    element: <GuestLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
       {
        path: "/contact",
        element: <Contact />,
      },
      // {
      //   path: "/users",
      //   element: <Users />,
      // },
      { path: "*", element: <NotFound /> },
    ],
  },

  {
    path: "/authentication",
    element: <AuthenticationPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordForm />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordForm />,
  },
  {
    element: <PatientLayout />,
    children: [
      {
        path: "/patient/dashboard",
        element: <DashboardPatient />,
      },
    ],
  },
  {
    element: <CollaboratorLayout />,
    children: [
      {
        path: "/collaborator/dashboard",
        element: <DashboardCollaborator />,
      },
    ],
  },
]);
