import { Bell, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Partie gauche : Titre */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add New Medication
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Set up medication tracking and automated reminders
          </p>
        </div>

        {/* Partie droite : Recherche + Notification */}
        <div className="flex items-center gap-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          {/* Bouton notification */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}