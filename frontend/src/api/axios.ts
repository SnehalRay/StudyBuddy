import axios from "axios"
import useUserStore from "../store/userStore";
import { matchPath } from "react-router-dom";


// SpringBoot API client, nothing changed kept the same as old code
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
    withCredentials: true, // if you are using cookies/session
});


// new Python API client for listening in on Python Endpoint
export const pyapi = axios.create({
  baseURL: import.meta.env.VITE_PYTHON_BASE_URL || "http://localhost:8000",
  withCredentials: true,
})

// Add interceptor
api.interceptors.response.use(
  response => response,
  error => {

    const status = error.response?.status;
    const message = error.response?.data;

    if (status === 401) {
      console.warn("🔒 JWT expired or missing. Logging out user.");

      // 1️⃣ Clear Zustand user store
      useUserStore.getState().setUser(null);

      // 2️⃣ Clear localStorage
      localStorage.removeItem("user");

      // 3️⃣ Redirect to landing (manual workaround here)
      window.location.href = "/"; // or "/authentication"

      // 4️⃣ Optionally, return a rejected promise to prevent further handling
      return Promise.reject(error);
    }

    // 2️⃣ Handle missing folderSession on /workbook/:id routes
    if (status === 400 && message === "Invalid or missing folder session.") {
      const currentPath = window.location.pathname;
      const isWorkbook = !!matchPath("/workbook/:folderName", currentPath);

      if (isWorkbook) {
        console.warn("📁 Invalid folderSession. Redirecting to /app");
        window.location.href = "/app";
        return Promise.reject(error);
      }
    }




    return Promise.reject(error);
  }
);