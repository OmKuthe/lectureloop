import axios from "axios";

const API = axios.create({
  baseURL: "https://lectureloop-0dnq.onrender.com",
});

export default API;