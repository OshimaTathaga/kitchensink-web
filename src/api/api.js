import axios from "axios";
import {jwtDecode} from "jwt-decode"; // To decode the token's expiration

export const api = axios.create({
  baseURL: "http://localhost:9000", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set token in the Axios instance
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// Request interceptor to handle token expiration
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Token is expired
        setAuthToken(null); // Remove token
        window.location.href = "/"; // Redirect to login
      }
    }
    
    return config;
  },
  
  error => Promise.reject(error)
);
