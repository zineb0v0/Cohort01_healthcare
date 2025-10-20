import { useState, useEffect, useRef } from "react";
import ProfileSection from "../../components/PatientComponents/Profile/ProfileSection";
import PersonalInformation from "../../components/PatientComponents/Profile/PersonalInformation";
import MedicalConditions from "../../components/PatientComponents/Profile/MedicalConditions";
import AccountActivity from "../../components/PatientComponents/Profile/AccountActivity";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

import { Bell, Check, Calendar, AlertCircle, Info } from "lucide-react";
import toast from "react-hot-toast";
export default function ProfilePage() {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_birth: "",
    address: "",
    allergies: "None reported",
    emergency_contact: "",
  });
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState(null);
  const [formData, setFormData] = useState({ ...userData });
  const [accountStats, setAccountStats] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ NOTIFICATIONS STATES
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationsRef = useRef(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // ✅ SYNC FORM DATA WHEN USERDATA UPDATES
  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  // ✅ FETCH USER PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");
        console.log("Fetched profile:", response.data);

        setUserData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          date_birth: response.data.date_birth || "",
          address: response.data.address || "",
          emergency_contact: response.data.emergency_contact || "",
          allergies: response.data.allergies || "None reported",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // ✅ FETCH ACCOUNT ACTIVITY
  useEffect(() => {
    const fetchAccountActivity = async () => {
      try {
        const response = await api.get("/patient/account-activity");
        console.log("Fetched activity:", response.data);

        const data = response.data;
        setAccountStats([
          { label: "Member Since", value: data.member_since },
          { label: "Total Appointments", value: data.total_appointments },
          { label: "Last Login", value: data.last_login_at },
        ]);
      } catch (error) {
        console.error("Error fetching account activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountActivity();
  }, []);

  // ✅ FETCH NOTIFICATIONS (mock data pour l'instant)
  useEffect(() => {
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

  // ✅ HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ MARK NOTIFICATION AS READ
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // ✅ MARK ALL AS READ
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  // ✅ TOGGLE NOTIFICATIONS DROPDOWN
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // ✅ CANCEL EDITING
  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
    console.log("Editing cancelled");
  };

  // ✅ SAVE UPDATED PROFILE - FIXED VERSION
  const handleSave = async () => {
    try {
      // Validation for required fields
      if (!formData.first_name?.trim()) {
        setNotification({
          show: true,
          message: "Please enter your first name",
          type: "warning",
        });
        return;
      }

      if (!formData.last_name?.trim()) {
        setNotification({
          show: true,
          message: "Please enter your last name",
          type: "warning",
        });
        return;
      }

      if (!formData.email?.trim()) {
        setNotification({
          show: true,
          message: "Please enter your email address",
          type: "warning",
        });
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setNotification({
          show: true,
          message: "Please enter a valid email address",
          type: "warning",
        });
        return;
      }

      // Phone format validation
      if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
        setNotification({
          show: true,
          message: "Please enter a valid phone number",
          type: "warning",
        });
        return;
      }

      // Birthdate validation - FIXED (no duplicates)
      if (formData.date_birth) {
        const birthDate = new Date(formData.date_birth);
        const today = new Date();
        const minDate = new Date("1900-01-01");

        if (isNaN(birthDate.getTime())) {
          setNotification({
            show: true,
            message: "Please enter a valid date of birth",
            type: "warning",
          });
          return;
        }

        if (birthDate > today) {
          setNotification({
            show: true,
            message: "Date of birth cannot be in the future",
            type: "warning",
          });
          return;
        }

        if (birthDate < minDate) {
          setNotification({
            show: true,
            message: "Please enter a realistic date of birth",
            type: "warning",
          });
          return;
        }
      }

      // Emergency contact validation
      if (
        formData.emergency_contact &&
        !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.emergency_contact)
      ) {
        setNotification({
          show: true,
          message: "Please enter a valid emergency contact number",
          type: "warning",
        });
        return;
      }

      // Prepare data for API - NO NAME SPLITTING NEEDED!
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || "",
        address: formData.address || "",
        date_birth: formData.date_birth || "",
        emergency_contact: formData.emergency_contact || "",
        gender: formData.gender || "",
      };

      // Remove empty fields to avoid validation issues
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === "") {
          delete updateData[key];
        }
      });

      console.log("Sending update data:", updateData);

      // Make API call to update profile
      const response = await api.put("/profile", updateData);

      console.log("Profile updated successfully:", response.data);

      // Update local state with the response from server
      setUserData({
        ...formData,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        email: response.data.email,
        phone: response.data.phone,
        address: response.data.address,
        date_birth: response.data.date_birth,
        emergency_contact: response.data.emergency_contact,
      });

      setIsEditing(false);
      setNotification({
        show: true,
        message: "Profile updated successfully!",
        type: "success",
      });

      // Auto hide success notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    } catch (error) {
      console.error("Error saving profile:", error);

      let errorMessage = "Failed to save profile. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage = `Validation errors: ${errors.join(", ")}`;
      }

      setNotification({
        show: true,
        message: errorMessage,
        type: "error",
      });
    }
  };

  // ✅ LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await api.post("/logout");

      // Suppression du token et le rôle
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");

      // Suppression de l'email uniquement si l'utilisateur n'a pas coché "Remember Me"
      const rememberEmail = localStorage.getItem("remember_email");
      if (!rememberEmail) {
        localStorage.removeItem("remember_email");
      }

      toast.success("Déconnexion réussie");
      navigate("/authentication", { replace: true });
    } catch (error) {
      console.error("Échec de la déconnexion", error);
      toast.error("Erreur lors de la déconnexion.");
    }
  };

  // ✅ LOADING STATE
  if (loading) {
    return <div className="p-10 text-gray-500">Loading profile...</div>;
  }

  // ✅ NOTIFICATION COMPONENT
  const Notification = () => {
    if (!notification.show) return null;

    const bgColor = {
      success: "bg-green-50 border-green-200",
      error: "bg-red-50 border-red-200",
      warning: "bg-yellow-50 border-yellow-200",
    }[notification.type];

    const textColor = {
      success: "text-green-800",
      error: "text-red-800",
      warning: "text-yellow-800",
    }[notification.type];

    return (
      <div
        className={`fixed top-4 right-4 z-50 border rounded-lg p-4 shadow-lg ${bgColor} ${textColor} max-w-sm`}
      >
        <div className="flex items-center justify-between">
          <span>{notification.message}</span>
          <button
            onClick={() =>
              setNotification({ show: false, message: "", type: "" })
            }
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  // ✅ UI
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Notification />
      <main className="flex-1 p-8">
        {/* Header WITH NOTIFICATIONS */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">My Profile</h1>

          {/* Notifications Button with Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={toggleNotifications}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 font-medium relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                {/* Dropdown Header */}
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

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Aucune notification
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const IconComponent = notification.icon;
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                notification.type === "appointment"
                                  ? "bg-blue-100 text-blue-600"
                                  : notification.type === "reminder"
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              <IconComponent size={16} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-800 text-sm">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <Check size={14} />
                                  </button>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mt-1">
                                {notification.message}
                              </p>
                              <span className="text-xs text-gray-400 mt-2 block">
                                {notification.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Dropdown Footer */}
                <div className="p-3 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Voir toutes les notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Header Section */}
        <ProfileSection
          userData={userData}
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          updateProfile={handleSave}
          cancelEdit={handleCancel} // Added cancel function
          logout={handleLogout}
        />

        {/* Profile Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2 space-y-8">
            <PersonalInformation
              userData={formData}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <MedicalConditions
              userData={formData}
              isEditing={isEditing}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-8">
            <AccountActivity accountStats={accountStats} />
          </div>
        </div>
      </main>
    </div>
  );
}
