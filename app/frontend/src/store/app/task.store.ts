import { create } from "zustand";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";
import { useLoaderStore } from "@/store/app/loader.store";
import type { TaskDetail } from "shared-types";

interface CreateTaskForm {
  id?: number;
  name: string;
  description: string;
  slug: string;
  isActive: boolean;
  order: string | number;
}

const defaultForm: CreateTaskForm = {
  id: undefined,
  name: "",
  description: "",
  slug: "",
  isActive: true,
  order: "",
};

interface TaskState {
  isCreateModalOpen: boolean;
  createForm: CreateTaskForm;
  selectedTask: TaskDetail | null;

  openCreateModal: () => void;
  closeCreateModal: () => void;
  setCreateFormField: <K extends keyof CreateTaskForm>(field: K, value: CreateTaskForm[K]) => void;
  resetCreateForm: () => void;
  createTask: (successCallback?: () => void) => Promise<void>;
  updateTask: (successCallback?: () => void) => Promise<void>;
  deleteTask: (id: number, successCallback?: () => void) => Promise<void>;
  setSelectedTask: (id: number | null) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  isCreateModalOpen: false,
  createForm: { ...defaultForm },
  selectedTask: null,

  openCreateModal: () => set({ isCreateModalOpen: true }),

  closeCreateModal: () => {
    set({ isCreateModalOpen: false, createForm: { ...defaultForm }, selectedTask: null });
  },

  setCreateFormField: (field, value) => {
    set((state) => ({
      createForm: { ...state.createForm, [field]: value },
    }));
  },

  resetCreateForm: () => set({ createForm: { ...defaultForm }, selectedTask: null }),

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

  updateTask: async (successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();
    const { createForm, selectedTask } = get();

    if (!selectedTask) return;

    startLoader("updateTask");
    try {
      await api.post(`${endpoints.task.update}${selectedTask.id}`, {
        id: createForm.id,
        name: createForm.name,
        description: createForm.description || undefined,
        slug: createForm.slug,
        isActive: createForm.isActive,
        order: createForm.order ? Number(createForm.order) : undefined,
      });
      get().closeCreateModal();
      successCallback?.();
    } catch (err) {
      console.error("Update task failed:", err);
    } finally {
      stopLoader("updateTask");
    }
  },

  deleteTask: async (id: number, successCallback?: () => void) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    const { startLoader, stopLoader } = useLoaderStore.getState();
    startLoader("deleteTask");
    try {
      await api.delete(`${endpoints.task.delete}${id}`);
      successCallback?.();
    } catch (err) {
      console.error("Delete task failed:", err);
    } finally {
      stopLoader("deleteTask");
    }
  },

  setSelectedTask: async (id: number | null) => {
    if (id !== null) {
      const { startLoader, stopLoader } = useLoaderStore.getState();
      startLoader("fetchTask");
      try {
        const response = await api.get(`${endpoints.task.detail}${id}`);
        if (response.data.success) {
          const task = response.data.data;
          set({
            selectedTask: task,
            createForm: {
              id: task.id,
              name: task.name,
              description: task.description || "",
              slug: task.slug,
              isActive: task.isActive,
              order: task.order ?? "",
            },
            isCreateModalOpen: true,
          });
        }
      } catch (err) {
        console.error("Fetch task failed:", err);
      } finally {
        stopLoader("fetchTask");
      }
    } else {
      set({ selectedTask: null, createForm: { ...defaultForm } });
    }
  },
}));
