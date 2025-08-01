// src/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:5000', // Flask backend
  withCredentials: true,            // Allow cookie-based sessions
});

export default api;
