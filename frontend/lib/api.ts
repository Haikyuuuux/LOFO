import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001", // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
