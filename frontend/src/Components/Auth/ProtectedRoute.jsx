import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token"); 

  if (!token) {
    return <Navigate to="/authentication" replace />;
  }

  return children;
}
