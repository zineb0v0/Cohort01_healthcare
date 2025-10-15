import { useState, useEffect } from "react";
import api from "../../../lib/axios.js";
export default function BookAppointment() {
  const [collaborators, setCollaborators] = useState([]);
  const [selectedCollaborator, setSelectedCollaborator] = useState("");
  const [type, setType] = useState("presentiel");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [patientId, setPatientId] = useState(null);
  const [loadingCollaborators, setLoadingCollaborators] = useState(true);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [error, setError] = useState("");

  // Récupérer info patient
  useEffect(() => {
    setLoadingPatient(true);
    api.get("/api/me")
      .then(res => {
        if (res.data?.patient?.id) {
          setPatientId(res.data.patient.id);
        } else {
          setError("Impossible de récupérer l'ID du patient.");
        }
      })
      .catch(err => setError("Erreur lors de la récupération du patient"))
      .finally(() => setLoadingPatient(false));
  }, []);

 useEffect(() => {
  setLoadingCollaborators(true);
  api.get("/api/collaborators/available")
    .then(res => {
      console.log("Raw collaborators response:", res); // <--- ajouter ça
      console.log("res.data:", res.data);
      setCollaborators(res.data); // si res.data est bien un tableau
    })
    .catch(err => {
      console.error("Erreur lors de la récupération des collaborateurs", err);
      setError("Erreur lors de la récupération des collaborateurs");
    })
    .finally(() => setLoadingCollaborators(false));
}, []);


  const handleSubmit = () => {
    if (!selectedCollaborator || !date || !time) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    api.post("/api/appointments", {
      patient_id: patientId,
      collaborator_id: selectedCollaborator,
      date,
      time,
      type
    })
    .then(() => alert("Rendez-vous réservé !"))
    .catch(() => alert("Erreur lors de la réservation."));
  };

  if (loadingPatient || loadingCollaborators) return <p>Chargement...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Choisir un médecin</h2>
      <select value={selectedCollaborator} onChange={e => setSelectedCollaborator(e.target.value)}>
        <option value="">-- Sélectionner --</option>
        {collaborators.length === 0 && <option value="">Aucun collaborateur disponible</option>}
        {collaborators.map(c => (
          <option key={c.id} value={c.id}>
            {c.user?.profile?.first_name || "?"} {c.user?.profile?.last_name || "?"} - {c.speciality || "N/A"}
          </option>
        ))}
      </select>

      <h3>Type de rendez-vous</h3>
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="presentiel">Présentiel</option>
        <option value="appel">Appel</option>
        <option value="appel_video">Appel vidéo</option>
      </select>

      <h3>Date & Heure</h3>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input type="time" value={time} onChange={e => setTime(e.target.value)} />

      <button onClick={handleSubmit} disabled={!patientId || collaborators.length === 0}>
        Réserver
      </button>
    </div>
  );
}
