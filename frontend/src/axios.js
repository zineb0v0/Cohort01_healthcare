import axios from "axios";

//  base URL for all requests
axios.defaults.baseURL = "http://localhost:8000/";

//  default headers
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";

// Authorization header automatically will be added if token exists
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // Getting the token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token for stateless requests
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
