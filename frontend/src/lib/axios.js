import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Intercepteur pour utiliser le BON token
api.interceptors.request.use(
  (config) => {
    // Essaie d'abord access_token, puis auth_token comme fallback
    const token = localStorage.getItem("access_token") || localStorage.getItem("auth_token");
    
    console.log("🔐 Token utilisé:", token ? "PRÉSENT" : "ABSENT");
    console.log("🔐 Source:", localStorage.getItem("access_token") ? "access_token" : 
                localStorage.getItem("auth_token") ? "auth_token" : "AUCUN");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token ajouté aux headers");
    } else {
      console.warn("❌ Aucun token trouvé");
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;