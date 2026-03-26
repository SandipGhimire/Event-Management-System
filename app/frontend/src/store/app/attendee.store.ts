import { create } from "zustand";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";
import { useLoaderStore } from "@/store/app/loader.store";

interface CreateAttendeeForm {
  name: string;
  email: string;
  phoneNumber: string;
  clubName: string;
  membershipID: string;
  qrCode: string;
  isVeg: boolean;
}

const defaultForm: CreateAttendeeForm = {
  name: "",
  email: "",
  phoneNumber: "",
  clubName: "",
  membershipID: "",
  qrCode: "",
  isVeg: false,
};

interface AttendeeState {
  isCreateModalOpen: boolean;
  createForm: CreateAttendeeForm;

  openCreateModal: () => void;
  closeCreateModal: () => void;
  setCreateFormField: <K extends keyof CreateAttendeeForm>(field: K, value: CreateAttendeeForm[K]) => void;
  resetCreateForm: () => void;
  createAttendee: (successCallback?: () => void) => Promise<void>;
}

export const useAttendeeStore = create<AttendeeState>((set, get) => ({
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

  createAttendee: async (successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();
    const { createForm } = get();

    startLoader("createAttendee");
    try {
      await api.post(endpoints.attendees.create, {
        name: createForm.name,
        email: createForm.email,
        phoneNumber: createForm.phoneNumber || undefined,
        clubName: createForm.clubName || undefined,
        membershipID: createForm.membershipID || undefined,
        qrCode: createForm.qrCode || undefined,
        isVeg: createForm.isVeg,
      });
      get().closeCreateModal();
      successCallback?.();
    } catch (err) {
      console.error("Create attendee failed:", err);
    } finally {
      stopLoader("createAttendee");
    }
  },
}));
