// src/api/http.ts
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL,
});

// 🔥 Toujours injecter le token + JSON
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  config.headers = config.headers ?? {};
  config.headers["Content-Type"] = "application/json";
  config.headers.Accept = "application/json";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

