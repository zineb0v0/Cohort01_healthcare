import { Edit, Trash2 } from "lucide-react";

export default function MedicationList({ medications, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 flex justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!medications || medications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
        Aucun médicament enregistré
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {medications.map((med) => (
        <div
          key={med.id}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-5 flex flex-col justify-between hover:shadow-lg transition-all"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {med.medication_name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {med.dosage} {med.unit} — {med.frequency}
            </p>

            <div className="text-xs text-gray-500 space-y-1">
              <p>
                <span className="font-medium text-gray-700">Début :</span>{" "}
                {new Date(med.start_date).toLocaleDateString("fr-FR")}
              </p>
              <p>
                <span className="font-medium text-gray-700">Fin :</span>{" "}
                {med.end_date
                  ? new Date(med.end_date).toLocaleDateString("fr-FR")
                  : "—"}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => onEdit(med)}
              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(med.id)}
              className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
