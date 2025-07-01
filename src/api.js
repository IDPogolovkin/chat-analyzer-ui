import axios from "axios";
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,    // ← set at build time
});
export default api;
