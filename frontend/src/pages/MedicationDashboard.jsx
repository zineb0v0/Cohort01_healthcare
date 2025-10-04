import { useState, useEffect } from 'react';
import { Clock, Check, X, AlertCircle, Trash2, Edit, Plus } from 'lucide-react';

// Component: MedicationItem
function MedicationItem({ medication, onTakeNow }) {
  const { id, medication_name, dosage, unit, scheduled_time, status } = medication;
  
  const getStatusConfig = (status, scheduled_time) => {
    const now = new Date();
    const scheduledTime = new Date(scheduled_time);
    const isPastDue = now > scheduledTime;
    
    switch(status) {
      case 'taken':
        return {
          bgColor: 'bg-green-50 border-green-200',
          dotColor: 'bg-green-500',
          icon: <Check className="w-6 h-6 text-green-600" />,
          iconBg: 'bg-green-100',
          showButton: false
        };
      case 'missed':
        return {
          bgColor: 'bg-red-50 border-red-200',
          dotColor: 'bg-red-500',
          icon: <X className="w-6 h-6 text-red-600" />,
          iconBg: 'bg-red-100',
          buttonColor: 'bg-red-500 hover:bg-red-600',
          buttonText: 'Take Now (Late)',
          showButton: true
        };
      case 'late':
        return {
          bgColor: 'bg-yellow-50 border-yellow-200',
          dotColor: 'bg-yellow-500',
          icon: <AlertCircle className="w-6 h-6 text-yellow-600" />,
          iconBg: 'bg-yellow-100',
          showButton: false
        };
      case 'scheduled':
        // Si scheduled et l'heure est passée, afficher en rouge
        if (isPastDue) {
          return {
            bgColor: 'bg-rose-50 border-rose-300',
            dotColor: 'bg-rose-500',
            icon: <AlertCircle className="w-6 h-6 text-rose-600" />,
            iconBg: 'bg-rose-100',
            showButton: true,
            buttonColor: 'bg-rose-500 hover:bg-rose-600',
            buttonText: 'Take Now (Late)'
          };
        }
        // Si scheduled et l'heure n'est pas encore passée, afficher en blanc
        return {
          bgColor: 'bg-white border-gray-100',
          dotColor: 'bg-green-500',
          icon: null,
          showButton: true,
          buttonColor: 'bg-green-500 hover:bg-green-600',
          buttonText: 'Take Now'
        };
      default:
        return {
          bgColor: 'bg-white border-gray-100',
          dotColor: 'bg-green-500',
          icon: null,
          showButton: true,
          buttonColor: 'bg-green-500 hover:bg-green-600',
          buttonText: 'Take Now'
        };
    }
  };

  const config = getStatusConfig(status, scheduled_time);
  const time = new Date(scheduled_time).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${config.bgColor} hover:border-gray-300 transition-all`}>
      <div className="flex items-center gap-4">
        <div className={`w-4 h-4 rounded-full flex-shrink-0 ${config.dotColor}`}></div>
        <div>
          <p className="font-semibold text-gray-900 text-base">{medication_name}</p>
          <p className="text-sm text-gray-500 mt-0.5">
            {dosage && unit ? `${dosage} ${unit} - ${time}` : time}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {config.icon && (
          <div className={`w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center`}>
            {config.icon}
          </div>
        )}
        {config.showButton && (
          <button
            onClick={() => onTakeNow(id)}
            className={`${config.buttonColor} text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm`}
          >
            {config.buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

// Component: TodaysMedicationsCard
function TodaysMedicationsCard({ medications, onTakeNow, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
          <Clock className="w-4 h-4 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Médicaments d'aujourd'hui</h3>
      </div>
      {!medications || medications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun médicament à prendre aujourd'hui</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {medications.map((med, index) => (
            <MedicationItem key={`${med.id}-${index}`} medication={med} onTakeNow={onTakeNow} />
          ))}
        </div>
      )}
    </div>
  );
}

// Component: MedicationList
function MedicationList({ medications, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!medications || medications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center py-8 text-gray-500">
          <p>Aucun médicament enregistré</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fréquence</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date début</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date fin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medications.map((med) => (
              <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{med.medication_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{med.dosage} {med.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{med.frequency}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {new Date(med.start_date).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {med.end_date ? new Date(med.end_date).toLocaleDateString('fr-FR') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(med)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(med.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Component: AddMedicationModal
function AddMedicationModal({ isOpen, onClose, onSubmit, editData = null }) {
  const [formData, setFormData] = useState({
    medication_name: '',
    dosage: '',
    unit: 'mg',
    frequency: '',
    start_date: '',
    end_date: '',
    prescribed_by: '',
    instructions: '',
    possible_side_effects: '',
    take_with_food: false,
    as_needed_prn: false,
    reminders: [{ time: '08:00', active: true }]
  });

  useEffect(() => {
    if (editData) {
      const reminders = editData.reminder_schedule 
        ? editData.reminder_schedule.split(',').map(time => ({ time, active: true }))
        : [{ time: '08:00', active: true }];
      
      setFormData({
        medication_name: editData.medication_name || '',
        dosage: editData.dosage || '',
        unit: editData.unit || 'mg',
        frequency: editData.frequency || '',
        start_date: editData.start_date || '',
        end_date: editData.end_date || '',
        prescribed_by: editData.prescribed_by || '',
        instructions: editData.instructions || '',
        possible_side_effects: editData.possible_side_effects || '',
        take_with_food: editData.take_with_food || false,
        as_needed_prn: editData.as_needed_prn || false,
        reminders: reminders
      });
    } else {
      setFormData({
        medication_name: '',
        dosage: '',
        unit: 'mg',
        frequency: '',
        start_date: '',
        end_date: '',
        prescribed_by: '',
        instructions: '',
        possible_side_effects: '',
        take_with_food: false,
        as_needed_prn: false,
        reminders: [{ time: '08:00', active: true }]
      });
    }
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addReminder = () => {
    setFormData(prev => ({
      ...prev,
      reminders: [...prev.reminders, { time: '12:00', active: true }]
    }));
  };

  const removeReminder = (index) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.filter((_, i) => i !== index)
    }));
  };

  const updateReminder = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.map((r, i) => i === index ? { ...r, [field]: value } : r)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reminder_schedule = formData.reminders.filter(r => r.active).map(r => r.time).join(',');
    const dataToSubmit = {
      ...formData,
      reminder_schedule,
      frequency: formData.reminders.filter(r => r.active).length
    };
    delete dataToSubmit.reminders;
    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-white/30 backdrop-blur-sm">
  <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {editData ? 'Modifier le médicament' : 'Medication Details'}
              </h2>
              <p className="text-sm text-gray-500">
                {editData ? 'Modifiez les informations du médicament' : 'Enter the basic information about your medication'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medication Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="medication_name"
              value={formData.medication_name}
              onChange={handleChange}
              placeholder="Enter medication name"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={handleChange}
                placeholder="e.g 10"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="mg">mg</option>
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="tablets">tablets</option>
                <option value="drops">drops</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              placeholder="How often do you take this?"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date (optional)</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prescribed By</label>
            <input
              type="text"
              name="prescribed_by"
              value={formData.prescribed_by}
              onChange={handleChange}
              placeholder="Doctor's name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Reminder Schedule</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Set up when you want to be reminded</p>
            
            <div className="space-y-3">
              {formData.reminders.map((reminder, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg border">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reminder.active}
                      onChange={(e) => updateReminder(index, 'active', e.target.checked)}
                      className="w-12 h-6 appearance-none bg-gray-300 rounded-full relative cursor-pointer transition-colors checked:bg-green-500 before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-6"
                    />
                  </label>
                  <input
                    type="time"
                    value={reminder.time}
                    onChange={(e) => updateReminder(index, 'time', e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <span className="text-sm text-gray-600">Reminder active</span>
                  {formData.reminders.length > 1 && (
                    <button
                      onClick={() => removeReminder(index)}
                      className="ml-auto text-red-600 hover:bg-red-50 p-1.5 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              onClick={addReminder}
              className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Another Reminder
            </button>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="take_with_food"
                checked={formData.take_with_food}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Take with food</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="as_needed_prn"
                checked={formData.as_needed_prn}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">As needed (PRN)</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Additional instructions..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Possible Side Effects</label>
            <textarea
              name="possible_side_effects"
              value={formData.possible_side_effects}
              onChange={handleChange}
              placeholder="List any known side effects..."
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
          >
            {editData ? 'Mettre à jour' : 'Add Medication'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function Medications() {
  const [activeTab, setActiveTab] = useState('analyses');
  const [medications, setMedications] = useState([]);
  const [todayIntakes, setTodayIntakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);

  const getAuthToken = () => '4|lIsX29h8F4kQBhhfxl0BgLF28gyLiqkwBw34i5zuf79338be';

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
        headers: { 'Authorization': `Bearer ${getAuthToken()}`, 'Content-Type': 'application/json' }
      });
      const intakes = await response.json();

      const formattedIntakes = intakes.intakes.map(intake => ({
        id: intake.intake_id,
        medication_name: intake.medication_name,
        dosage: intake.dosage,
        unit: intake.unit,
        scheduled_time: intake.scheduled_time,
        status: intake.status
      }));

      setTodayIntakes(formattedIntakes);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
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