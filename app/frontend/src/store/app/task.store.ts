import { create } from "zustand";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";
import { useLoaderStore } from "@/store/app/loader.store";

interface CreateTaskForm {
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  order: string | number;
}

const defaultForm: CreateTaskForm = {
  name: "",
  description: "",
  slug: "",
  isActive: true,
  order: "",
};

interface TaskState {
  isCreateModalOpen: boolean;
  createForm: CreateTaskForm;

  openCreateModal: () => void;
  closeCreateModal: () => void;
  setCreateFormField: <K extends keyof CreateTaskForm>(field: K, value: CreateTaskForm[K]) => void;
  resetCreateForm: () => void;
  createTask: (successCallback?: () => void) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
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

  createTask: async (successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();
    const { createForm } = get();

    startLoader("createTask");
    try {
      await api.post(endpoints.task.create, {
        name: createForm.name,
        description: createForm.description || undefined,
        slug: createForm.slug,
        isActive: createForm.isActive,
        order: createForm.order ? Number(createForm.order) : undefined,
      });
      get().closeCreateModal();
      successCallback?.();
    } catch (err) {
      console.error("Create task failed:", err);
    } finally {
      stopLoader("createTask");
    }
  },
}));
