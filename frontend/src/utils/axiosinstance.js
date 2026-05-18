import axios from "axios";
import { clearAuthSession, getRefreshToken, saveAuthSession } from "./authStorage";

const baseURL =
  import.meta.env.VITE_API_URL || "https://matty-backend-2.onrender.com";

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("token");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;
    if (status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/api/auth/refresh")) {
      clearAuthSession();
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuthSession();
      return Promise.reject(error);
    }

    if (!refreshPromise) {
      refreshPromise = axiosInstance
        .post("/api/auth/refresh", { refreshToken })
        .then((res) => {
          const payload = res.data?.data || res.data;
          const token = payload?.token || res.data?.token;
          const nextRefreshToken = payload?.refreshToken || res.data?.refreshToken;

          const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
          saveAuthSession({
            token,
            refreshToken: nextRefreshToken,
            user: currentUser,
          });
          return token;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    try {
      const nextToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${nextToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      clearAuthSession();
      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
