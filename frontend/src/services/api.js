import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://lectureloop-0dnq.onrender.com";

console.log("🌐 API Base URL:", BASE_URL);

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

export const fileUploadAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,

});


API.interceptors.request.use(
  (config) => {
    console.log(`📤 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(
        `❌ API Error ${error.response.status}: ${error.response.config?.url}`
      );
      console.error("Error details:", error.response.data);
    } else if (error.request) {
      console.error("❌ No response from server. Backend may be down.");
    } else {
      console.error("❌ Axios setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default API;