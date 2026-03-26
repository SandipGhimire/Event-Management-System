import axios from "axios";
import endpoints from "@/core/app/endpoints";
import { isDevelopment } from "@/core/utils/common.utils";
import jwtServices from "@/core/app/jwt";
import { useAuthStore } from "@/store/auth/auth.store";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  function (config) {
    if (isDevelopment()) {
      const token = jwtServices.getToken();
      if (token) {
        if (!config.headers["Authorization"]) config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const { setIsAuthenticated } = useAuthStore.getState();

    if (status === 401 && originalRequest.url === endpoints.auth.refresh) {
      setIsAuthenticated(false);
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      let data = {};
      if (isDevelopment()) {
        const refreshToken = jwtServices.getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");
        data = { refresh: refreshToken };
      }
      await api
        .post(endpoints.auth.refresh, data, {
          headers: {
            Authorization: `Bearer ${jwtServices.getRefreshToken()}`,
          },
        })
        .then((response) => {
          if (isDevelopment()) {
            const token = response.data.accessToken;
            jwtServices.setToken(token);
            const refreshToken = response.data.refreshToken;
            jwtServices.setRefreshToken(refreshToken);
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
          }
          setIsAuthenticated(true);
        })
        .catch((e) => {
          console.error("Token refresh failed", e);
          setIsAuthenticated(false);
          throw e;
        });
      return await axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
