import React, { useEffect, useState } from "react";
import api from "../../lib/axios";

export default function RendezVousCollaborator() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

  // 🟢 Charger les rendez-vous
  const fetchAppointments = async () => {
    try {
      const response = await api.get("/api/collaborator/appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const sorted = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setAppointments(sorted);
    } catch (error) {
      console.error("Erreur lors du chargement des rendez-vous:", error);
      showAlert("Erreur lors du chargement des rendez-vous !", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 🟢 Fonction pour afficher une alerte personnalisée
  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 3000); // disparaît après 3s
  };

  // 🟢 Changer le statut (confirmé ou annulé)
  const handleStatusChange = async (id, action) => {
    try {
      const url =
        action === "confirm"
          ? `/api/collaborator/appointments/${id}/confirm`
          : `/api/collaborator/appointments/${id}/cancel`;

      await api.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      showAlert(
        `Rendez-vous ${action === "confirm" ? "confirmé ✅" : "annulé ❌"} !`,
        action === "confirm" ? "success" : "warning"
      );
      fetchAppointments();
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      showAlert("Une erreur est survenue ❗", "error");
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="p-8 relative">
      {/* 🟢 Alerte personnalisée */}
      {alert.message && (
        <div
          className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-lg text-white font-medium z-50 transition-all duration-500 ${
            alert.type === "success"
              ? "bg-green-500"
              : alert.type === "error"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="p-4 sm:p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          📅 Mes rendez-vous
        </h1>

        {appointments.length === 0 ? (
          <p className="text-gray-500 text-lg">
            Aucun rendez-vous pour le moment.
          </p>
        ) : (
          <>
            {/* Table pour PC */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg text-sm sm:text-base">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Patient</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Heure</th>
                    <th className="py-3 px-4 text-left">Statut</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">
                      Lien Téléconsultation
                    </th>
                    <th className="py-3 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b hover:bg-blue-50 transition-colors"
                    >
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-700">
                        {a.patient?.user?.profile?.first_name}{" "}
                        {a.patient?.user?.profile?.last_name}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {new Date(a.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {a.time || "-"}
                      </td>
                      <td
                        className={`py-3 px-4 font-semibold capitalize ${
                          a.status === "confirmed"
                            ? "text-green-600"
                            : a.status === "canceled"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {a.status}
                      </td>
                      <td className="py-3 px-4">
                        {a.is_telehealth ? (
                          <span className="text-blue-600 font-medium">
                            Téléconsultation
                          </span>
                        ) : (
                          <span className="text-gray-600">Présentiel</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {a.telehealth_url ? (
                          <a
                            href={a.telehealth_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline hover:text-blue-700 transition-colors"
                          >
                            Ouvrir
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3 px-4 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleStatusChange(a.id, "confirm")}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-lg shadow-sm transition-all"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => handleStatusChange(a.id, "cancel")}
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-lg shadow-sm transition-all"
                        >
                          Annuler
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards pour mobile */}
            <div className="md:hidden space-y-4">
              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                >
                  <p className="font-semibold text-gray-800">
                    {a.patient?.user?.profile?.first_name}{" "}
                    {a.patient?.user?.profile?.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(a.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Heure: {a.time || "-"}
                  </p>
                  <p
                    className={`text-sm font-medium capitalize ${
                      a.status === "confirmed"
                        ? "text-green-600"
                        : a.status === "canceled"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    Statut: {a.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    Type: {a.is_telehealth ? "Téléconsultation" : "Présentiel"}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      onClick={() => handleStatusChange(a.id, "confirm")}
                      className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm shadow-sm transition-all"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => handleStatusChange(a.id, "cancel")}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm shadow-sm transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
