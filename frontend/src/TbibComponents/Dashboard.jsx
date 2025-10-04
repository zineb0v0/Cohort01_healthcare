import { useEffect, useState } from "react";
import api from "../lib/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    appointmentsCount: 0,
    patientsCount: 0,
    confirmedAppointments: 0,
    canceledAppointments: 0,
    doctorName: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, patientsRes, profileRes] = await Promise.all([
          api.get("/api/collaborator/appointments"),
          api.get("/api/collaborator/patients"),
          api.get("/api/collaborator/profile"),
        ]);

        const appointments = appointmentsRes.data;
        const confirmed = appointments.filter(a => a.status === "confirmed").length;
        const canceled = appointments.filter(a => a.status === "canceled").length;

        setStats({
          appointmentsCount: appointments.length,
          patientsCount: patientsRes.data.length,
          confirmedAppointments: confirmed,
          canceledAppointments: canceled,
          doctorName: profileRes.data.name,
        });
      } catch (err) {
        console.error("Erreur lors du chargement du dashboard", err);
      }
    };

    fetchData();
  }, []);

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
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Résumé rapide
          </h2>
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
