import axios from "axios";

// Create instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
});

// Response Interceptor for handling 401 Unauthorized (Token Expiration)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token using HttpOnly refresh cookie
        await api.post("/auth/refresh");
        
        // If successful, retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, user must log in again
        // Here you could dispatch a logout action if needed
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
