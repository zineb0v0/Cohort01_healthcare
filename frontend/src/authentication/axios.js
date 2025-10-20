// src/api/axios.js
import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token automatically
api.interceptors.request.use(
  (config) => {
    // Try access_token first, fallback to auth_token
    const token = localStorage.getItem("access_token") || localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(" Token added to headers");
    } else {
      console.warn(" No token found");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Erreur réseau. Veuillez vérifier votre connexion.");
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      toast.error("Session expirée, veuillez vous reconnecter.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("role");
      window.location.href = "/authentication"; // redirect to login
    }

    if (error.response.status === 403) {
      toast.error("Accès refusé : rôle non autorisé.");
    }

    return Promise.reject(error);
  }
);

export default api;
