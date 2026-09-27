import axios from "axios";
import { getRefreshToken } from "../utils/getToken";
let refreshPromise = null;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    const isAuthRequest = originalRequest.url?.includes("/auth/");
    if (isAuthRequest && !originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    const clearSession = () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    };

    if (originalRequest._retry) {
      clearSession();
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = getRefreshToken();
          const response = await axios.post(
            api.getUri({ url: "/auth/refresh" }),
            { refreshToken },
          );
          const tokens = response.data?.data;
          if (!tokens?.accessToken || !tokens?.refreshToken) {
            throw new Error("Refresh response did not contain both tokens");
          }

          localStorage.setItem("accessToken", tokens.accessToken);
          localStorage.setItem("refreshToken", tokens.refreshToken);
          return tokens;
        })().finally(() => {
          refreshPromise = null;
        });
      }

      const tokens = await refreshPromise;
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearSession();
      return Promise.reject(refreshError);
    }
  },
);
export default api;
