import { create } from "zustand";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";
import { useLoaderStore } from "@/store/app/loader.store";

interface CreateUserForm {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const defaultForm: CreateUserForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  username: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

interface UserState {
  isCreateModalOpen: boolean;
  createForm: CreateUserForm;

  openCreateModal: () => void;
  closeCreateModal: () => void;
  setCreateFormField: <K extends keyof CreateUserForm>(field: K, value: CreateUserForm[K]) => void;
  resetCreateForm: () => void;
  createUser: (successCallback?: () => void) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  isCreateModalOpen: false,
  createForm: { ...defaultForm },

  openCreateModal: () => set({ isCreateModalOpen: true }),

  closeCreateModal: () => {
    set({ isCreateModalOpen: false, createForm: { ...defaultForm } });
  },

  setCreateFormField: (field, value) => {
    set((state) => ({
      createForm: { ...state.createForm, [field]: value },
    }));
  },

  resetCreateForm: () => set({ createForm: { ...defaultForm } }),

  createUser: async (successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();
    const { createForm } = get();

    startLoader("createUser");
    try {
      await api.post(endpoints.user.create, {
        firstName: createForm.firstName,
        middleName: createForm.middleName || undefined,
        lastName: createForm.lastName,
        email: createForm.email,
        username: createForm.username,
        phoneNumber: createForm.phoneNumber || undefined,
        password: createForm.password,
      });
      get().closeCreateModal();
      successCallback?.();
    } catch (err) {
      console.error("Create user failed:", err);
    } finally {
      stopLoader("createUser");
    }
  },
}));
