import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { toast } from "react-hot-toast";

function DashboardPatient() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user");
        setUser(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de récupérer les informations utilisateur.");
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
      toast.error("Erreur lors de la déconnexion.");
    }
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="p-10">
      <p className="text-sm">Role: {user.role}</p>

      {user.profile && (
        <div className="mt-4">
          <p>Nom: {user.profile.first_name} {user.profile.last_name}</p>
          <p>Téléphone: {user.profile.phone}</p>
          <p>Adresse: {user.profile.address}</p>
          <p>Date de naissance: {user.profile.date_birth}</p>
          <p>Genre: {user.profile.gender}</p>
          {user.profile.urgency_number && (
            <p>Numéro d'urgence: {user.profile.urgency_number}</p>
          )}
        </div>
      )}

      {user.patient && (
        <div className="mt-4">
          <p>Patient ID: {user.patient.id}</p>
          {/* Add more patient-specific fields if available */}
        </div>
      )}

      <Button
        className="bg-foreground/90 text-white text-lg py-2 px-4 mt-6"
        onClick={handleLogout}
      >
        Se déconnecter
      </Button>
    </div>
  );
}

export default DashboardPatient;
