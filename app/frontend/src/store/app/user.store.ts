import { create } from "zustand";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";
import { useLoaderStore } from "@/store/app/loader.store";

interface UserForm {
  id?: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
}

const defaultForm: UserForm = {
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
  isModalOpen: boolean;
  form: UserForm;
  mode: "create" | "edit";

  openModal: (mode: "create" | "edit", user?: any) => void;
  closeModal: () => void;
  setFormField: <K extends keyof UserForm>(field: K, value: UserForm[K]) => void;
  resetForm: () => void;
  saveUser: (successCallback?: () => void) => Promise<void>;
  deleteUser: (id: number, successCallback?: () => void) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  isModalOpen: false,
  form: { ...defaultForm },
  mode: "create",

  openModal: (mode, user) => {
    if (mode === "edit" && user) {
      set({
        isModalOpen: true,
        mode,
        form: {
          id: user.id,
          firstName: user.firstName,
          middleName: user.middleName || "",
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          phoneNumber: user.phoneNumber || "",
        },
      });
    } else {
      set({ isModalOpen: true, mode: "create", form: { ...defaultForm } });
    }
  },

  closeModal: () => {
    set({ isModalOpen: false, form: { ...defaultForm } });
  },

  setFormField: (field, value) => {
    set((state) => ({
      form: { ...state.form, [field]: value },
    }));
  },

  resetForm: () => set({ form: { ...defaultForm } }),

  saveUser: async (successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();
    const { form, mode } = get();

    startLoader("saveUser");
    try {
      if (mode === "create") {
        await api.post(endpoints.user.create, {
          firstName: form.firstName,
          middleName: form.middleName || undefined,
          lastName: form.lastName,
          email: form.email,
          username: form.username,
          phoneNumber: form.phoneNumber || undefined,
          password: form.password,
        });
      } else {
        await api.patch(endpoints.user.update.replace(":id", String(form.id)), {
          firstName: form.firstName,
          middleName: form.middleName || undefined,
          lastName: form.lastName,
          email: form.email,
          username: form.username,
          phoneNumber: form.phoneNumber || undefined,
          password: form.password || undefined,
        });
      }
      get().closeModal();
      successCallback?.();
    } catch (err) {
      console.error("Save user failed:", err);
    } finally {
      stopLoader("saveUser");
    }
  },

  deleteUser: async (id: number, successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();

    if (!confirm("Are you sure you want to delete this user?")) return;

    startLoader("deleteUser");
    try {
      await api.delete(endpoints.user.delete.replace(":id", String(id)));
      successCallback?.();
    } catch (err) {
      console.error("Delete user failed:", err);
    } finally {
      stopLoader("deleteUser");
    }
  },
}));
