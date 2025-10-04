import { CheckCircle, Clock } from 'lucide-react';

export default function TodaysMedicationsCard({ medications, onTakeNow, loading }) {
  if (loading) return <div>Loading...</div>;
  if (!medications.length) return <div>Aucun médicament pour aujourd'hui</div>;

  return (
    <div className="space-y-3">
      {medications.map(med => (
        <div key={med.id} className="p-3 border rounded-lg flex justify-between items-center">
          <div>
            <h4 className="font-semibold">{med.medication_name}</h4>
            <p>{med.dosage}</p>
            <p>Status: {med.status}</p>
          </div>
          {(med.status === 'scheduled' || med.status === 'late') && (
            <button
              onClick={() => onTakeNow(med.id)}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Take Now
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
