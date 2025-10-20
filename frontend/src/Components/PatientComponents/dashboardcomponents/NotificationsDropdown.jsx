// components/PatientComponents/NotificationsDropdown.jsx
import  { useState, useRef, useEffect } from "react";
import { Bell, Check, Calendar, AlertCircle, Info } from "lucide-react";

export default function NotificationsDropdown() {
  // ✅ NOTIFICATIONS STATES
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationsRef = useRef(null);

  useEffect(() => {
    // Mock notifications
    const mockNotifications = [
      {
        id: 1,
        type: "appointment",
        title: "Rendez-vous confirmé",
        message:
          "Votre rendez-vous avec Dr. Smith est confirmé pour demain à 14:00",
        time: "Il y a 5 min",
        read: false,
        icon: Calendar,
      },
      {
        id: 2,
        type: "reminder",
        title: "Rappel de médicament",
        message: "N'oubliez pas de prendre votre traitement",
        time: "Il y a 1 heure",
        read: false,
        icon: AlertCircle,
      },
      {
        id: 3,
        type: "info",
        title: "Nouvelle fonctionnalité",
        message: "Découvrez notre nouveau système de suivi de santé",
        time: "Il y a 2 heures",
        read: true,
        icon: Info,
      },
      {
        id: 4,
        type: "appointment",
        title: "Rappel de rendez-vous",
        message: "Rendez-vous dentaire dans 3 jours à 10:00",
        time: "Il y a 1 jour",
        read: true,
        icon: Calendar,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);
  }, []);

  // ✅ CLOSE NOTIFICATIONS WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={notificationsRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 font-medium relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Aucune notification
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !n.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          n.type === "appointment"
                            ? "bg-blue-100 text-blue-600"
                            : n.type === "reminder"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-800 text-sm">
                            {n.title}
                          </h4>
                          {!n.read && (
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Check size={14} />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{n.message}</p>
                        <span className="text-xs text-gray-400 mt-2 block">
                          {n.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-3 border-t border-gray-100">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
              Voir toutes les notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
