import { Plus } from 'lucide-react';

export default function AddMedicationButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
    >
      <Plus className="w-5 h-5" />
      Add medicament
    </button>
  );
}