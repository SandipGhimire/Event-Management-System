export interface LoginDetails {
    username: string;
    password: string;
    cloudflareToken?: string;
}

export interface UserDetails {
    id: number;
    username: string;
    full_name: string;
    email: string;
    phone: number | null;
    department: string | null;
    isSuperUser: boolean;
    roles: [];
    permissions: string[];
}

export interface AuthState {
  loginDetails: LoginDetails
  isAuthenticated: boolean
  user: UserDetails

  getUserDetails: () => UserDetails | undefined
  getLoginDetails: () => LoginDetails
  getIsAuthenticated: () => boolean

  login: (loginDetails: LoginDetails) => Promise<void>
  logout: () => Promise<void>
  getUser: () => Promise<void>
}
