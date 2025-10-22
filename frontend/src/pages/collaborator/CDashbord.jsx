import  { useEffect, useState } from "react";
import api from "../../lib/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null); // null to show loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        // Fetch all in parallel
        const [appointmentsRes, patientsRes, collaboratorRes] = await Promise.all([
          api.get("/api/collaborator/appointments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/collaborator/patients", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/collaborator/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const appointments = appointmentsRes.data;
        const patients = patientsRes.data;
        const collaborator = collaboratorRes.data;

        // Count confirmed and canceled in a single loop
        const { confirmed, canceled } = appointments.reduce(
          (acc, a) => {
            if (a.status === "confirmed") acc.confirmed++;
            if (a.status === "canceled") acc.canceled++;
            return acc;
          },
          { confirmed: 0, canceled: 0 }
        );

        const doctorName = collaborator.user?.profile
          ? `${collaborator.user.profile.first_name} ${collaborator.user.profile.last_name}`
          : "";

        setStats({
          appointmentsCount: appointments.length,
          patientsCount: patients.length,
          confirmedAppointments: confirmed,
          canceledAppointments: canceled,
          doctorName,
        });
      } catch (err) {
        console.error("Erreur lors du chargement du dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500 text-lg">         ⏳ Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Bonjour, Dr. {stats.doctorName || "—"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
            <h3 className="text-gray-500 text-sm">Total des rendez-vous</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.appointmentsCount}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
            <h3 className="text-gray-500 text-sm">Patients suivis</h3>
            <p className="text-3xl font-bold text-green-600">{stats.patientsCount}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
            <h3 className="text-gray-500 text-sm">Rendez-vous confirmés</h3>
            <p className="text-3xl font-bold text-teal-600">{stats.confirmedAppointments}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
            <h3 className="text-gray-500 text-sm">Rendez-vous annulés</h3>
            <p className="text-3xl font-bold text-red-500">{stats.canceledAppointments}</p>
          </div>
        </div>

        <div className="mt-10 bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Résumé rapide</h2>
          <p className="text-gray-600">
            Vous avez actuellement <strong>{stats.appointmentsCount}</strong> rendez-vous,
            dont <strong>{stats.confirmedAppointments}</strong> confirmés et{" "}
            <strong>{stats.canceledAppointments}</strong> annulés.
          </p>
        </div>
      </div>
    </div>
  );
}
