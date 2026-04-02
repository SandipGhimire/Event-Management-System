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
  roleIds: number[];
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
  roleIds: [],
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

  openModal: async (mode, user) => {
    if (mode === "edit" && user) {
      const { startLoader, stopLoader } = useLoaderStore.getState();
      startLoader("saveUser"); // Use same loader for simplicity
      try {
        const { data: res } = await api.get(endpoints.user.self.replace("self", String(user.id)));
        const userDetail = res.data;
        if (userDetail) {
          set({
            isModalOpen: true,
            mode,
            form: {
              id: userDetail.id,
              firstName: userDetail.firstName,
              middleName: userDetail.middleName || "",
              lastName: userDetail.lastName,
              email: userDetail.email,
              username: userDetail.username,
              phoneNumber: userDetail.phoneNumber || "",
              roleIds: userDetail.roleIds || [],
            },
          });
        }
      } catch (err) {
        console.error("Failed to fetch user details", err);
      } finally {
        stopLoader("saveUser");
      }
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
          roleIds: form.roleIds.map(String),
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
          roleIds: form.roleIds.map(String),
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
