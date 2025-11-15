import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import api from "../../../lib/axios";

export default function CollaboratorLayout() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const res = await api.get("/api/collaborator/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data?.user?.profile || res.data);
      } catch (err) {
        console.error("Erreur lors du chargement du profil:", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar profile={profile} />
      <div className="flex-1 p-4 pt-16 lg:pl-64">
        <Outlet context={{ profile, setProfile }} />
      </div>
    </div>
  );
}
