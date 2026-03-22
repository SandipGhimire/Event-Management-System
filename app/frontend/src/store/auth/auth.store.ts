import type { AuthStore, LoginDetail } from "@/core/types/auth.type";
import { create } from "zustand";
import { useLoaderStore } from "../app/loader.store";
import api from "@/core/app/api";
import jwtServices from "@/core/app/jwt";
import { isDevelopment } from "@/core/utils/common.utils";
import endpoints from "@/core/app/endpoints";

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  loginDetail: {
    email: "",
    password: "",
  },

  //Setters
  setIsAuthenticated: (isAuthenticated: boolean) => {
    set({ isAuthenticated });
  },
  setLoginDetail: (loginDetail: LoginDetail) => {
    set({ loginDetail });
  },

  //Actions
  login: async (successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();

    startLoader("login");
    await api
      .post(endpoints.auth.login, get().loginDetail)
      .then((res) => {
        if (isDevelopment()) {
          const { accessToken, refreshToken } = res.data;
          jwtServices.setToken(accessToken);
          jwtServices.setRefreshToken(refreshToken);
        }
        set({ isAuthenticated: true });
        successCallback?.();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        stopLoader("login");
      });
  },

  getUser: async () => {
    await api
      .get(endpoints.user.self)
      .then((res) => {
        console.log(res.data);
        set({ isAuthenticated: true });
        console.log(get().isAuthenticated);
      })
      .catch(() => {
        set({ isAuthenticated: false });
      });
  },
}));
