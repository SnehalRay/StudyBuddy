import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    withCredentials: true, // if you are using cookies/session
});

export default api;