import { useState, useEffect } from 'react';
import { Clock, X, Plus } from 'lucide-react';

export default function AddMedicationModal({ isOpen, onClose, onSubmit, editData = null }) {
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