import axios from "axios";

// Konfigurasi base URL untuk API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Membuat instance axios dengan konfigurasi default
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk request
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Interceptor untuk response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", error);

    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`API Error ${status}:`, data.message || "Unknown error");
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error: No response from server");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }

    return Promise.reject(error);
  }
);

// API functions untuk data masyarakat
export const masyarakatAPI = {
  // Mendapatkan semua data masyarakat
  getAll: async () => {
    const response = await api.get("/masyarakat");
    return response.data;
  },

  // Mendapatkan data masyarakat berdasarkan ID
  getById: async (id) => {
    const response = await api.get(`/masyarakat/${id}`);
    return response.data;
  },

  // Menambah data masyarakat baru
  create: async (data) => {
    const response = await api.post("/masyarakat", data);
    return response.data;
  },

  // Mengupdate data masyarakat
  update: async (id, data) => {
    const response = await api.put(`/masyarakat/${id}`, data);
    return response.data;
  },

  // Menghapus data masyarakat
  delete: async (id) => {
    const response = await api.delete(`/masyarakat/${id}`);
    return response.data;
  },

  // Mencari data masyarakat
  search: async (keyword) => {
    const response = await api.get(`/masyarakat/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },
};

export default api;
