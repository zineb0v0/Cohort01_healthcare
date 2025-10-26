import { Bell, Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gray-50 border-b border-gray-200 px-4 sm:px-8 py-4 pl-15">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        {/* Titre */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add New Medication
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Set up medication tracking and automated reminders
          </p>
        </div>

        {/* Recherche + Notification */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Barre de recherche */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 sm:w-80"
            />
          </div>

       
        </div>
      </div>
    </header>
  );
}