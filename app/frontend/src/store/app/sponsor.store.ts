import { create } from "zustand";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";
import { useLoaderStore } from "@/store/app/loader.store";

interface CreateSponsorForm {
  name: string;
  email: string;
  phoneNumber: string;
  logo: string;
  description: string;
  contribution: string;
  isActive: boolean;
  order: string | number;
}

const defaultForm: CreateSponsorForm = {
  name: "",
  email: "",
  phoneNumber: "",
  logo: "",
  description: "",
  contribution: "",
  isActive: true,
  order: "",
};

interface SponsorState {
  isCreateModalOpen: boolean;
  createForm: CreateSponsorForm;

  openCreateModal: () => void;
  closeCreateModal: () => void;
  setCreateFormField: <K extends keyof CreateSponsorForm>(field: K, value: CreateSponsorForm[K]) => void;
  resetCreateForm: () => void;
  createSponsor: (successCallback?: () => void) => Promise<void>;
}

export const useSponsorStore = create<SponsorState>((set, get) => ({
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

  createSponsor: async (successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();
    const { createForm } = get();

    startLoader("createSponsor");
    try {
      await api.post(endpoints.sponsor.create, {
        name: createForm.name,
        email: createForm.email || undefined,
        phoneNumber: createForm.phoneNumber || undefined,
        logo: createForm.logo || undefined,
        description: createForm.description || undefined,
        contribution: createForm.contribution || undefined,
        isActive: createForm.isActive,
        order: createForm.order ? Number(createForm.order) : undefined,
      });
      get().closeCreateModal();
      successCallback?.();
    } catch (err) {
      console.error("Create sponsor failed:", err);
    } finally {
      stopLoader("createSponsor");
    }
  },
}));
