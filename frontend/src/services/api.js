import axios from 'axios';

// Get the correct base URL based on environment
const getBaseURL = () => {
  // For production (Render)
  if (process.env.NODE_ENV === 'production') {
    // Remove any trailing /api from the URL
    const url = process.env.REACT_APP_API_URL || 'https://lectureloop-0dnq.onrender.com';
    return url.replace(/\/api$/, ''); // Remove /api if present
  }
  // For development (local)
  return 'http://localhost:5000';
};

const BASE_URL = getBaseURL();

console.log('API Base URL:', BASE_URL);

// Main API client for JSON requests
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data ',
  },
  timeout: 30000, // 30 seconds timeout for file uploads
});

// API client for file uploads (multipart/form-data)
export const fileUploadAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 30000,
});

// Request interceptor for debugging
API.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ API Error ${error.response.status}: ${error.response.config?.url}`);
      console.error('Error details:', error.response.data);
      
      if (error.response.status === 404) {
        console.error('Endpoint not found. Check if the URL is correct.');
      }
    } else if (error.request) {
      console.error('No response received from server. Check if backend is running.');
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default API;