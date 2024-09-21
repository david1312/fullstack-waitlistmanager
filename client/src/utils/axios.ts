import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.API_BASE_URL || 'http://localhost:8080',
  timeout: 5000, // Set a timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
