import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://lectureloop-0dnq.onrender.com/api',
  //                                                            add /api here ^^^^
  headers: {
    'Content-Type': 'application/json',
  },
});

// For file uploads, you'll need a separate instance or override headers
export const fileUploadAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://lectureloop-0dnq.onrender.com/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default API;