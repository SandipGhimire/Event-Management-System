import { create } from "zustand";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";
import { useLoaderStore } from "@/store/app/loader.store";

interface CreateSponsorForm {
  id?: number;
  name: string;
  email: string;
  phoneNumber: string;
  logo: string | File;
  description: string;
  contribution: string;
  isActive: boolean;
  order: string | number;
  links: { label: string; url: string }[];
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
  links: [{ label: "", url: "" }],
};

interface SponsorState {
  isCreateModalOpen: boolean;
  createForm: CreateSponsorForm;
  selectedSponsor: any;

  openCreateModal: () => void;
  closeCreateModal: () => void;
  setCreateFormField: <K extends keyof CreateSponsorForm>(field: K, value: CreateSponsorForm[K]) => void;
  setLinkField: (index: number, field: "label" | "url", value: string) => void;
  addLink: () => void;
  removeLink: (index: number) => void;
  resetCreateForm: () => void;
  createSponsor: (successCallback?: () => void) => Promise<void>;
  updateSponsor: (successCallback?: () => void) => Promise<void>;
  errors: any;
  setError: (errors: any) => void;
  setSelectedSponsor: (id: number | null) => Promise<void>;
}

export const useSponsorStore = create<SponsorState>((set, get) => ({
  isCreateModalOpen: false,
  createForm: { ...defaultForm },
  selectedSponsor: null,
  errors: null,

  setError: (errors: any) => {
    set({ errors });
    setTimeout(() => set({ errors: null }), 5000);
  },

  openCreateModal: () => set({ isCreateModalOpen: true }),

  closeCreateModal: () => {
    set({ isCreateModalOpen: false, createForm: { ...defaultForm }, selectedSponsor: null });
  },

  setCreateFormField: (field, value) => {
    set((state) => ({
      createForm: { ...state.createForm, [field]: value },
    }));
  },

  setLinkField: (index, field, value) => {
    set((state) => {
      const newLinks = [...state.createForm.links];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return {
        createForm: { ...state.createForm, links: newLinks },
      };
    });
  },

  addLink: () => {
    set((state) => ({
      createForm: {
        ...state.createForm,
        links: [...state.createForm.links, { label: "", url: "" }],
      },
    }));
  },

  removeLink: (index) => {
    set((state) => ({
      createForm: {
        ...state.createForm,
        links: state.createForm.links.filter((_, i) => i !== index),
      },
    }));
  },

  resetCreateForm: () => set({ createForm: { ...defaultForm }, selectedSponsor: null }),

  createSponsor: async (successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();
    const { createForm } = get();

    startLoader("createSponsor");

    const formData = new FormData();
    Object.entries(createForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "links") {
          formData.append(key, JSON.stringify((value as any).filter((l: any) => l.label && l.url)));
        } else {
          formData.append(key, value instanceof File ? value : String(value));
        }
      }
    });

    try {
      await api.post(endpoints.sponsor.create, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      get().closeCreateModal();
      successCallback?.();
    } catch (err: any) {
      get().setError(err.response?.data?.error || "Failed to create sponsor");
      console.error("Create sponsor failed:", err);
    } finally {
      stopLoader("createSponsor");
    }
  },

  updateSponsor: async (successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();
    const { createForm, selectedSponsor } = get();

    if (!selectedSponsor) return;

    startLoader("updateSponsor");

    const formData = new FormData();
    Object.entries(createForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "links") {
          formData.append(key, JSON.stringify((value as any).filter((l: any) => l.label && l.url)));
        } else {
          formData.append(key, value instanceof File ? value : String(value));
        }
      }
    });

    try {
      await api.post(`${endpoints.sponsor.update}${selectedSponsor.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      get().closeCreateModal();
      successCallback?.();
    } catch (err: any) {
      get().setError(err.response?.data?.error || "Failed to update sponsor");
      console.error("Update sponsor failed:", err);
    } finally {
      stopLoader("updateSponsor");
    }
  },

  setSelectedSponsor: async (id: number | null) => {
    if (id !== null) {
      const { startLoader, stopLoader } = useLoaderStore.getState();
      startLoader("fetchSponsor");
      try {
        const response = await api.get(`${endpoints.sponsor.detail}${id}`);
        if (response.data.success) {
          const sponsor = response.data.data;
          set({
            selectedSponsor: sponsor,
            createForm: {
              id: sponsor.id,
              name: sponsor.name,
              email: sponsor.email || "",
              phoneNumber: sponsor.phoneNumber || "",
              logo: sponsor.logo || "",
              description: sponsor.description || "",
              contribution: sponsor.contribution || "",
              isActive: sponsor.isActive,
              order: sponsor.order || "",
              links:
                sponsor.links && sponsor.links.length > 0
                  ? sponsor.links.map((l: any) => ({ label: l.label, url: l.url }))
                  : [{ label: "", url: "" }],
            },
            isCreateModalOpen: true,
          });
        }
      } catch (err) {
        console.error("Fetch sponsor failed:", err);
      } finally {
        stopLoader("fetchSponsor");
      }
    } else {
      set({ selectedSponsor: null, createForm: { ...defaultForm } });
    }
  },
}));
