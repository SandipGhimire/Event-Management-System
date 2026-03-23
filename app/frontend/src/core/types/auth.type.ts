import type { UserDetail } from "shared-types";

export interface LoginDetail {
  email: string;
  password: string;
}

export interface AuthStore {
  isAuthenticated: boolean;
  loginDetail: LoginDetail;
  user: UserDetail;

  // Setters
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setLoginDetail: (loginDetail: LoginDetail) => void;

  // Actions
  login: (successCallback?: () => void) => void;
  logout: (successCallback?: () => void) => void;
  getUser: () => void;
}
