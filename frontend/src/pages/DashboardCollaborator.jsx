import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { toast } from "react-hot-toast";

function DashboardCollaborator() {
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState(null);

  const customToastSuccessStyle = {
    backgroundColor: "#15800f",
    color: "white",
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setToken(localStorage.getItem("access_token"));
      setRole(localStorage.getItem("role"));
    };

    fetchDashboardData();
  }, [navigate]);
  console.log(role);
  console.log(token);
  if (!token || role !== "Collaborateur") {
    navigate("/authentication");
    return;
  }
  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.log("Token is missing, user is not logged in.");
      return;
    }

    try {
      const response = await axios.post("/api/logout", {});

      localStorage.removeItem("access_token");
      toast.success("Déconnexion réussie", { style: customToastSuccessStyle });
      navigate("/authentication"); // Redirect to login page
    } catch (error) {
      console.error("Échec de la déconnexion", error);
    }
  };

  return (
    <div className="dashboard-container">
      <p className="text-sm">Role: {role}</p>

      <p className="text-black">Hi from the collaborator dashboard page</p>

      <div className="flex flex-col items-center justify-center">
        <Button
          className="bg-foreground/90 py-2 px-4 text-white text-lg"
          onClick={handleLogout}
        >
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}

export default DashboardCollaborator;
