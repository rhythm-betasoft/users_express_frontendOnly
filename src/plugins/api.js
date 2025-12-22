import axios from "axios";
import { authStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

api.interceptors.request.use(
  (config) => {
    const store = authStore();
    const token = store.accessToken || localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;