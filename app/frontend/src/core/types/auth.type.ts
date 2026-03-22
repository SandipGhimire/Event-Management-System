export interface LoginDetail {
  email: string;
  password: string;
}

export interface AuthStore {
  isAuthenticated: boolean;
  loginDetail: LoginDetail;

  // Setters
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setLoginDetail: (loginDetail: LoginDetail) => void;

  // Actions
  login: (successCallback?: () => void) => void;
  getUser: () => void;
}
