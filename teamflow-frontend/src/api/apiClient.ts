import axios from "axios";

// One shared axios instance for the whole app. Every API function in
// src/api/ uses this instead of calling axios directly, so the base
// URL and auth header logic only live in one place.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
});

// Request interceptor: runs before every request leaves the browser.
// We read the JWT from localStorage and attach it as a Bearer token.
// This is simpler than passing the token through every function call,
// and it's the standard way axios supports "do this for every request".
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("teamflow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: if the backend ever says the token is invalid
// or expired (401), clear it and send the user back to login. Without
// this, the app would keep silently failing requests forever.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("teamflow_token");
      localStorage.removeItem("teamflow_user");
      // Full page redirect (not react-router) because at this point
      // we can't assume any React context is still in a good state.
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
