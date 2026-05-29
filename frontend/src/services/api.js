import axios from 'axios';

// Support both VITE_ and REACT_APP_ environment prefixes
const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  import.meta.env.REACT_APP_API_BASE_URL || 
  'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle expired token (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token has expired or is invalid, trigger logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Dispatch custom event to let AuthContext know about logout
      window.dispatchEvent(new Event('auth-logout'));
      
      // Redirect if not already on login page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = `/login?expired=true`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
