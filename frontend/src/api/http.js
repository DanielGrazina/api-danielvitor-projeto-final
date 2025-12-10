import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    const isLoginRequest = error.config && error.config.url.toLowerCase().includes("login");
    if (error.response?.status === 401 && !isLoginRequest) {
      console.warn("Sessão expirada. Faça login novamente.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const apiGet = async (path) => {
  const res = await api.get(path);
  return res.data;
};

export const apiPost = async (path, data) => {
  const res = await api.post(path, data);
  return res.data;
};

export const apiPut = async (path, data) => {
  const res = await api.put(path, data);
  return res.data;
};

export const apiDelete = async (path) => {
  const res = await api.delete(path);
  return res.data;
};

export default api;
