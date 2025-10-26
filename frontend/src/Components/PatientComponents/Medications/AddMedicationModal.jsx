import { useState, useEffect } from 'react';
import { Clock, X, Plus, AlertCircle } from 'lucide-react';

export default function AddMedicationModal({ isOpen, onClose, onSubmit, editData = null }) {
  const [formData, setFormData] = useState({
    medication_name: '',
    dosage: '',
    unit: 'mg',
    frequency: 1,
    start_date: '',
    end_date: '',
    prescribed_by: '',
    instructions: '',
    possible_side_effects: '',
    take_with_food: false,
    as_needed_prn: false,
    reminders: [{ time: '08:00', active: true }]
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (editData) {
      const reminders = editData.reminder_schedule 
        ? editData.reminder_schedule.split(',').map(time => ({ time, active: true }))
        : [{ time: '08:00', active: true }];
      
      setFormData({
        medication_name: editData.medication_name || '',
        dosage: editData.dosage || '',
        unit: editData.unit || 'mg',
        frequency: editData.frequency || 1,
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
        frequency: 1,
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
    setValidationError('');
  }, [editData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'frequency' ? parseInt(value) || 1 : value)
    }));
    
    if (validationError) {
      setValidationError('');
    }
  };

  const addReminder = () => {
    setFormData(prev => ({
      ...prev,
      reminders: [...prev.reminders, { time: '12:00', active: true }]
    }));
  };

  const removeReminder = (index) => {
    if (formData.reminders.length > 1) {
      setFormData(prev => ({
        ...prev,
        reminders: prev.reminders.filter((_, i) => i !== index)
      }));
    }
  };

  const updateReminder = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.map((r, i) => i === index ? { ...r, [field]: value } : r)
    }));
    
    if (validationError) {
      setValidationError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get active reminders
    const activeReminders = formData.reminders.filter(r => r.active);
    
    // Validation: Check if number of active reminders matches frequency
    if (activeReminders.length !== formData.frequency) {
      setValidationError(
        `Please set exactly ${formData.frequency} active reminder${formData.frequency > 1 ? 's' : ''} to match the frequency. Currently you have ${activeReminders.length} active reminder${activeReminders.length > 1 ? 's' : ''}.`
      );
      return;
    }

    // Prepare data
    const reminder_schedule = activeReminders.map(r => r.time);

    const dataToSubmit = {
      ...formData,
      reminder_schedule,
      frequency: formData.frequency
    };

    // Remove internal reminders state
    delete dataToSubmit.reminders;

    // Submit
    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  const activeRemindersCount = formData.reminders.filter(r => r.active).length;
  const isFrequencyMatched = activeRemindersCount === formData.frequency;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
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
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {validationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{validationError}</p>
            </div>
          )}

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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
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
              Frequency (times per day) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              placeholder="How many times per day?"
              min="1"
              max="10"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
            <p className="mt-1 text-xs text-gray-500">
              How many times per day do you take this medication?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date (optional)</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div className={`rounded-xl p-4 border-2 transition ${
            isFrequencyMatched 
              ? 'bg-green-50 border-green-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${isFrequencyMatched ? 'text-green-600' : 'text-amber-600'}`} />
                <h3 className="font-semibold text-gray-900">Reminder Schedule</h3>
              </div>
              <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                isFrequencyMatched 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {activeRemindersCount} / {formData.frequency} active
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Set up {formData.frequency} reminder time{formData.frequency > 1 ? 's' : ''} to match your frequency
            </p>
            
            <div className="space-y-3">
              {formData.reminders.map((reminder, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border-2 transition ${
                  reminder.active 
                    ? 'bg-white border-green-300' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reminder.active}
                      onChange={(e) => updateReminder(index, 'active', e.target.checked)}
                      className="w-12 h-6 appearance-none bg-gray-300 rounded-full relative cursor-pointer transition-colors checked:bg-green-500 before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-6 before:shadow-sm"
                    />
                  </label>
                  <input
                    type="time"
                    value={reminder.time}
                    onChange={(e) => updateReminder(index, 'time', e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                  <span className={`text-sm ${reminder.active ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                    {reminder.active ? 'Active' : 'Inactive'}
                  </span>
                  {formData.reminders.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReminder(index)}
                      className="ml-auto text-red-600 hover:bg-red-100 p-1.5 rounded-lg transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={addReminder}
              className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              Add Another Reminder
            </button>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="take_with_food"
                checked={formData.take_with_food}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">Take with food</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="as_needed_prn"
                checked={formData.as_needed_prn}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 transition">As needed (PRN)</span>
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none transition"
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
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none transition"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFrequencyMatched}
            className={`px-5 py-2.5 rounded-lg font-medium shadow-sm transition ${
              isFrequencyMatched
                ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {editData ? 'Mettre à jour' : 'Add Medication'}
          </button>
        </div>
      </div>
    </div>
  );
}