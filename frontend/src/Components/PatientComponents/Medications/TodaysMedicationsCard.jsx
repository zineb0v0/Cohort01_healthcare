import { Clock } from 'lucide-react';
import MedicationItem from './Medicationltem';

export default function TodaysMedicationsCard({ medications, onTakeNow, loading }) {
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