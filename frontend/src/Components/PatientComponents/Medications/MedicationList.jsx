import { Edit, Trash2 } from 'lucide-react';

export default function MedicationList({ medications, onEdit, onDelete, loading }) {
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