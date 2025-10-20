// components/PatientComponents/AppointmentsList.jsx
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import api from "../../../../authentication/axios";

export default function AppointmentsList({ selectedDate, setSelectedDate }) {
  const [appointments, setAppointments] = useState([]);

  const statusMap = {
    pending: "En attente",
    confirmed: "Confirmé",
    canceled: "Annulé",
    completed: "Terminé",
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("access_token");
        console.log(token);
        const res = await api.get("/api/patient/appointments", {
          headers: {
            Accept: "application/json",
          },
        });

        const mapped = res.data.map((a) => ({
          ...a,
          date: new Date(a.date),
          status: statusMap[a.status] || a.status,
          doctor: a.doctor || "Médecin inconnu",
          type: a.type,
          is_telehealth: a.is_telehealth || false,
        }));

        setAppointments(mapped);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  const selectedAppointment = selectedDate
    ? appointments.find(
        (a) => a.date.toDateString() === selectedDate.toDateString()
      )
    : null;

  // Prepare calendar modifiers for telehealth
  const modifiers = {
    appointments: appointments.map((a) => a.date),
    telehealth: appointments.filter((a) => a.is_telehealth).map((a) => a.date),
  };

  const modifiersClassNames = {
    appointments: "bg-blue-500 text-white rounded-full",
    telehealth: "bg-purple-500 text-white rounded-full border-2 border-white",
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Calendar */}
      <section className="bg-white p-6 rounded-lg shadow flex-1">
        <h2 className="text-xl font-bold mb-4">Calendrier des Rendez-vous</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
        />
        <p className="mt-2 text-sm text-gray-500">
          {/* Les jours en <span className="bg-purple-500 text-white px-1 rounded-full">violet</span> sont des téléconsultations. */}
          Les jours en violet sont des téléconsultations.
        </p>
      </section>

      {/* Selected Appointment */}
      <section className="bg-white p-6 rounded-lg shadow flex-1.1">
        <h2 className="text-xl font-bold mb-4">Informations du Rendez-vous</h2>
        {selectedAppointment ? (
          <div>
            <h3 className="font-bold text-lg mb-1">
              {selectedAppointment.title}
            </h3>
            <p>
              <strong>Date:</strong>{" "}
              {selectedAppointment.date.toLocaleDateString()}
            </p>
            <p>
              <strong>Heure:</strong> {selectedAppointment.time}
            </p>
            <p>
              <strong>Médecin:</strong> {selectedAppointment.doctor}
            </p>
            <p>
              <strong>Type:</strong> {selectedAppointment.type}
            </p>
            <p>
              <strong>Status:</strong> {selectedAppointment.status}
            </p>
            <p>
              <strong>Téléconsultation:</strong>{" "}
              {selectedAppointment.is_telehealth ? "Oui" : "Non"}
            </p>
            {selectedAppointment.is_telehealth &&
              selectedAppointment.telehealth_url && (
                <p>
                  <strong>Lien:</strong>{" "}
                  <a
                    href={selectedAppointment.telehealth_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Rejoindre
                  </a>
                </p>
              )}
          </div>
        ) : (
          <p className="text-lg pt-7 ">Aucun rendez-vous.</p>
        )}
      </section>

      {/* Appointments History */}
      <section className="bg-white p-6 rounded-lg shadow flex-1.1">
        <h2 className="text-xl font-bold mb-4">Historique des Rendez-vous</h2>
        <ul className="space-y-3 max-h-[400px] overflow-y-auto">
          {appointments
            .sort((a, b) => b.date - a.date)
            .map((a, idx) => (
              <li
                key={idx}
                className="p-4 rounded-lg shadow-sm flex justify-between items-center bg-white hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">{a.title}</p>
                  <p className="text-sm text-gray-500">
                    {a.date.toLocaleDateString()} - {a.time}
                  </p>
                  <p className="text-sm text-gray-500">
                    {a.doctor} | {a.type} |{" "}
                    {a.is_telehealth ? "Téléconsultation" : "En personne"}
                  </p>
                </div>
                <span
                  className={`font-semibold px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    a.status === "À venir"
                      ? "bg-blue-100 text-blue-700"
                      : a.status === "Terminé"
                      ? "bg-gray-200 text-gray-600"
                      : a.status === "Annulé"
                      ? "bg-red-100 text-red-700"
                      : a.status === "Confirmé"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {a.status}
                </span>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
