import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001", // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Default 15 second timeout
});

// Optional: attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.config.url);
    }
    return Promise.reject(error);
  }
);
