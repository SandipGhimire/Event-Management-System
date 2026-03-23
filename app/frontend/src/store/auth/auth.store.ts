import type { AuthStore, LoginDetail } from "@/core/types/auth.type";
import { create } from "zustand";
import { useLoaderStore } from "../app/loader.store";
import api from "@/core/app/api";
import jwtServices from "@/core/app/jwt";
import { isDevelopment } from "@/core/utils/common.utils";
import endpoints from "@/core/app/endpoints";
import type { UserDetail } from "shared-types";

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  loginDetail: {} as LoginDetail,
  user: {} as UserDetail,

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
        set({ isAuthenticated: true, loginDetail: {} as LoginDetail });
        successCallback?.();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        stopLoader("login");
      });
  },

  logout: async (successCallback?: () => void) => {
    await api
      .post(endpoints.auth.logout)
      .then(() => {
        set({ isAuthenticated: false });
        jwtServices.destroyToken();
        successCallback?.();
      })
      .catch(() => {
        set({ isAuthenticated: false });
        jwtServices.destroyToken();
        successCallback?.();
      });
  },

  getUser: async () => {
    await api
      .get(endpoints.user.self)
      .then((res) => {
        set({ isAuthenticated: true, user: res.data });
      })
      .catch(() => {
        set({ isAuthenticated: false });
      });
  },
}));
