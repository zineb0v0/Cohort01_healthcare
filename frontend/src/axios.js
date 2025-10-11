import axios from "axios";
import { toast } from "react-hot-toast";

// Base URL for all requests
axios.defaults.baseURL = "http://localhost:8000/";

// Default headers
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add token automatically if exists
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor for :
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // No response from server <=> network error
      toast.error("Erreur réseau. Veuillez vérifier votre connexion.");
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      toast.error("Session expirée, veuillez vous reconnecter.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      window.location.href = "/authentication";
    }

    if (error.response.status === 403) {
      toast.error("Accès refusé : rôle non autorisé.");
    }

    return Promise.reject(error);
  }
);

export default axios;
