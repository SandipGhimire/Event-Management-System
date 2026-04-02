import { create } from "zustand";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";
import { useLoaderStore } from "@/store/app/loader.store";

interface RoleForm {
  id?: number;
  name: string;
  description: string;
  permissionKeys: string[];
}

const defaultForm: RoleForm = {
  name: "",
  description: "",
  permissionKeys: [],
};

interface RoleState {
  isModalOpen: boolean;
  form: RoleForm;
  mode: "create" | "edit";

  openModal: (mode: "create" | "edit", role?: any) => void;
  closeModal: () => void;
  setFormField: <K extends keyof RoleForm>(field: K, value: RoleForm[K]) => void;
  resetForm: () => void;
  saveRole: (successCallback?: () => void) => Promise<void>;
  deleteRole: (id: number, successCallback?: () => void) => Promise<void>;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  isModalOpen: false,
  form: { ...defaultForm },
  mode: "create",

  openModal: (mode, role) => {
    if (mode === "edit" && role) {
      set({
        isModalOpen: true,
        mode,
        form: {
          id: role.id,
          name: role.name,
          description: role.description || "",
          permissionKeys: role.permissions?.map((p: any) => p.permission.key) || [],
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

  saveRole: async (successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();
    const { form, mode } = get();

    startLoader("saveRole");
    try {
      if (mode === "create") {
        await api.post(endpoints.role.create, {
          name: form.name,
          description: form.description || undefined,
          permissionKeys: form.permissionKeys,
        });
      } else {
        await api.patch(endpoints.role.update.replace(":id", String(form.id)), {
          name: form.name,
          description: form.description || undefined,
          permissionKeys: form.permissionKeys,
        });
      }
      get().closeModal();
      successCallback?.();
    } catch (err) {
      console.error("Save role failed:", err);
    } finally {
      stopLoader("saveRole");
    }
  },

  deleteRole: async (id: number, successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();

    if (!confirm("Are you sure you want to delete this role?")) return;

    startLoader("deleteRole");
    try {
      await api.delete(endpoints.role.delete.replace(":id", String(id)));
      successCallback?.();
    } catch (err) {
      console.error("Delete role failed:", err);
    } finally {
      stopLoader("deleteRole");
    }
  },
}));
