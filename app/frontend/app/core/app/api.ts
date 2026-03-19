import axios from "axios";
import endpoints from "./endpoints";
import { isDevelopment } from "../utils/common.util";
import jwtServices from "./jwt";
import { useAuthStore } from "~/store/Auth/auth.store";

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
                config.headers["Authorization"] = `Bearer ${token}`;
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
        const {isAuthenticated, setAuthenticated} = useAuthStore();

        if (status === 401 && originalRequest.url === endpoints.auth.refresh) {
            jwtServices.destroyToken();
            setAuthenticated(false);
            return Promise.reject(error);
        }

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                let data = {};
                if (isDevelopment()) {
                    const refreshToken = jwtServices.getRefreshToken();
                    if (!refreshToken) throw new Error("No refresh token");
                    data = { refresh: refreshToken };
                }
                await api.post(endpoints.auth.refresh, data).then((response) => {
                    if (isDevelopment()) {
                        const token = response.data.access;
                        jwtServices.setToken(token);
                        originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    }
                    setAuthenticated(true);
                });
                return await axios(originalRequest);
            } catch (e) {
                console.error("Token refresh failed", e);
                setAuthenticated(false);
                jwtServices.destroyToken();
                throw e;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
