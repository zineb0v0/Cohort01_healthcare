import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { toast } from "react-hot-toast";

function DashboardCollaborator() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user");
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      toast.success("Déconnexion réussie");
      navigate("/authentication");
    } catch (error) {
      console.error("Échec de la déconnexion", error);
    }
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="dashboard-container p-10">
      <p className="text-sm">Role: {user.role}</p>
      <p className="text-black">Hi from the collaborator dashboard page</p>

      {/* Example collaborator details */}
      {user.collaborator && (
        <div className="mt-4">
          <p>Spécialité: {user.collaborator.speciality}</p>
          <p>License: {user.collaborator.license_number}</p>
          <p>Workplace: {user.collaborator.workplace}</p>
        </div>
      )}

      <Button
        className="bg-foreground/90 py-2 px-4 text-white text-lg mt-4"
        onClick={handleLogout}
      >
        Se déconnecter
      </Button>
    </div>
  );
}

export default DashboardCollaborator;
