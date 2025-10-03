import axios from 'axios';

// Set base URL for axios requests
axios.defaults.baseURL = 'http://localhost:8000/';

// Enable cross-origin requests
axios.defaults.withCredentials = true; // Important for cross-origin requests

// Use the new withXSRFToken option as a workaround for the old withCredentials behavior
axios.defaults.withXSRFToken = true;

// Get the CSRF token from the meta tag
const csrfToken = document.head.querySelector('meta[name="csrf-token"]')?.content;

// Set the CSRF token in the headers dynamically
axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;

// Set the Accept header for all requests
axios.defaults.headers.common['Accept'] = 'application/json';

// Set the Content-Type header for all requests
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Ensure the CSRF token is included in every request
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // Get token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Add token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // 401 Handling (session expired)
// axios.interceptors.response.use(
//   (response) => response, // Return the response if it's successful
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Token is expired or invalid
//       alert("Session expired, please log in again.");
//       localStorage.removeItem("access_token"); // Clear the token

//       // Redirect to login page
//       window.location.href = "/authentication";
//     }
//     return Promise.reject(error);
//   }
// );

export default axios;
