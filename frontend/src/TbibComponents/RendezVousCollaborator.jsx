import React, { useEffect, useState } from "react";
import api from "../lib/axios";

export default function RendezVousCollaborator() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/api/collaborator/appointments", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📅 Mes rendez-vous</h1>

      {appointments.length === 0 ? (
        <p className="text-gray-500">Aucun rendez-vous pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Patient</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Heure</th>
                <th className="py-3 px-4 text-left">Statut</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Lien Téléconsultation</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{a.patient?.first_name} {a.patient?.last_name}</td>
                  <td className="py-3 px-4">{new Date(a.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{a.time || "-"}</td>
                  <td className="py-3 px-4 capitalize">{a.status}</td>
                  <td className="py-3 px-4">
                    {a.isTelehealth ? (
                      <span className="text-blue-600 font-medium">Téléconsultation</span>
                    ) : (
                      <span className="text-gray-600">Présentiel</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {a.telehealthLink ? (
                      <a
                        href={a.telehealthLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        Ouvrir
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
