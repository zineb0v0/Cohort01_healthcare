import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import { toast } from "sonner";

function DashboardPatient() {
  const navigate = useNavigate();

  const customToastSuccessStyle = {
    backgroundColor: "#15800f",
    color: "white",
  };
  const [role, setRole] = useState(null);
  const [token, setToken] = useState("");

  // Fetch the CSRF token to allow the session
  const getCsrfCookie = async () => {
    try {
      await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
        withCredentials: true, // Ensure cookies are included
      });
      console.log("CSRF cookie set!");
    } catch (error) {
      console.error("Error fetching CSRF cookie:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setToken(localStorage.getItem("access_token"));
      setRole(localStorage.getItem("role"));

      await getCsrfCookie();
    };

    fetchUserData();
  }, [navigate]);
  console.log(role);
  console.log(token);
  if (!token || role !== "Patient") {
    // Redirect if no token is found or the role is not Patient
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
      navigate("/authentication");
    } catch (error) {
      console.error("Échec de la déconnexion", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-evenly p-10">
        <div>
          <p className="text-sm">Role: {role}</p>
        </div>
        <Button
          className="bg-foreground/90 text-white text-lg py-2 px-4"
          onClick={handleLogout}
        >
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}

export default DashboardPatient;
