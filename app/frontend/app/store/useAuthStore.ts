import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async (credentials) => {
    // Simulate API call
    set({ isLoading: true });
    try {
      // In a real app, this would be an API call
      // const response = await fetch("/api/login", { method: "POST", body: JSON.stringify(credentials) });
      // const data = await response.json();
      
      // Simulating success
      const mockUser = { id: "1", name: "User", email: "user@example.com" };
      set({ user: mockUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      // Simulate API call to check session
      // const response = await fetch("/api/me");
      // if (response.ok) ...
      
      // For now, let's assume not authenticated initially unless session exists
      const hasSession = false; // logic to check cookie or token
      if (hasSession) {
        set({ user: { id: "1", name: "User", email: "user@example.com" }, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
