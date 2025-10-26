import { useState, useEffect } from 'react';
import { Clock, Plus } from 'lucide-react';
import TodaysMedicationsCard from '../../components/PatientComponents/Medications/TodaysMedicationsCard';
import MedicationList from '../../components/PatientComponents/Medications/MedicationList';
import AddMedicationModal from '../../Components/PatientComponents/Medications/AddMedicationModal';

export default function MedicationDashboard() {
  const [activeTab, setActiveTab] = useState('analyses');
  const [medications, setMedications] = useState([]);
  const [todayIntakes, setTodayIntakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);

    const getAuthToken = () => localStorage.getItem('access_token');
  const fetchMedications = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/patient/medications', {
        headers: { 'Authorization': `Bearer ${getAuthToken()}`, 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setMedications(data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

const fetchTodayIntakes = async () => {
  try {
    setLoading(true);

    const response = await fetch('http://localhost:8000/api/patient/today-intakes', {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json',
      },
    });

    // If server returned an error (404, 401, etc.)
    if (!response.ok) {
      const text = await response.text(); // could be HTML
      console.error('Server returned an error:', response.status, text);
      setTodayIntakes([]); // clear previous intakes
      setLoading(false);
      return;
    }

    const intakes = await response.json();

    if (!intakes || !intakes.intakes) {
      console.warn('No intakes data returned', intakes);
      setTodayIntakes([]);
      setLoading(false);
      return;
    }

    const formattedIntakes = intakes.intakes.map((intake) => ({
      id: intake.intake_id,
      medication_name: intake.medication_name,
      dosage: intake.dosage,
      unit: intake.unit,
      scheduled_time: intake.scheduled_time,
      status: intake.status,
    }));

    setTodayIntakes(formattedIntakes);
    setLoading(false);

  } catch (error) {
    console.error('Fetch error:', error);
    setTodayIntakes([]);
    setLoading(false);
  }
};
  


  useEffect(() => {
    fetchMedications();
    fetchTodayIntakes();
    const interval = setInterval(() => fetchTodayIntakes(), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleModalSubmit = async (formData) => {
    try {
      const url = editingMedication 
        ? `http://localhost:8000/api/patient/medications/${editingMedication.id}`
        : 'http://localhost:8000/api/patient/medications';
      
      const method = editingMedication ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: { 'Authorization': `Bearer ${getAuthToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        setEditingMedication(null);
        fetchMedications();
        fetchTodayIntakes();
      } else {
        alert(editingMedication ? 'Erreur lors de la modification du médicament' : 'Erreur lors de l\'ajout du médicament');
      }
    } catch (error) {
      alert(editingMedication ? 'Erreur lors de la modification du médicament' : 'Erreur lors de l\'ajout du médicament');
    }
  };

  const handleTake = async (intakeId) => {
    try {
      const intake = todayIntakes.find(i => i.id === intakeId);
      const now = new Date();
      const scheduledTime = new Date(intake.scheduled_time);
      const isLate = now > scheduledTime;
      
      const response = await fetch(`http://localhost:8000/api/patient/medication-intakes/${intakeId}/status`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getAuthToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: isLate ? 'late' : 'taken', taken_time: now.toISOString() })
      });
      if (response.ok) fetchTodayIntakes();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (medicationId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/patient/medications/${medicationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAuthToken()}`, 'Content-Type': 'application/json' }
      });
      if (response.ok) fetchMedications();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (medication) => {
    setEditingMedication(medication);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedication(null);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <AddMedicationModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleModalSubmit}
        editData={editingMedication}
      />
      
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Gestion des Médicaments</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add medicament
          </button>
        </div>

        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('analyses')}
            className={`pb-3 px-2 font-medium transition-colors ${
              activeTab === 'analyses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Analyses ({medications.length})
          </button>
          <button
            onClick={() => setActiveTab('encours')}
            className={`pb-3 px-2 font-medium transition-colors ${
              activeTab === 'encours' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            En cours ({todayIntakes.length})
          </button>
        </div>
      </div>

      {activeTab === 'analyses' ? (
        <MedicationList medications={medications} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      ) : (
        <TodaysMedicationsCard medications={todayIntakes} onTakeNow={handleTake} loading={loading} />
      )}
    </div>
  );
}