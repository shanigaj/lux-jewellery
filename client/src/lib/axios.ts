import axios from "axios";

// Create instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
  // Never let a stalled request spin the UI forever — surface an error instead.
  timeout: 30000,
});

// Response Interceptor for handling 401 Unauthorized (Token Expiration)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url: string = originalRequest?.url || "";

    // The auth endpoints must never trigger a refresh-and-retry: a 401 from
    // /auth/refresh (no valid cookie) or /auth/login (bad credentials) would
    // otherwise call /auth/refresh again — which 401s again — forever. Let those
    // 401s surface to the caller so the login form can show its error.
    const isAuthEndpoint =
      url.includes("/auth/refresh") ||
      url.includes("/auth/login") ||
      url.includes("/auth/logout");

    // If error is 401 on a protected call and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
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
