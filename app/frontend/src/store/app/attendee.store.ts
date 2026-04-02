import { create } from "zustand";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";
import { useLoaderStore } from "@/store/app/loader.store";
import type { CreateAttendeePayload } from "shared-types";
import type { AttendeeState } from "@/core/types/attendees.type";

const defaultForm: CreateAttendeePayload = {
  name: "",
  email: "",
  phoneNumber: "",
  clubName: "",
  membershipID: null as unknown as number,
  isVeg: false,
  position: "",
  profilePicture: null,
  paymentSlip: null,
};

export const useAttendeeStore = create<AttendeeState>((set, get) => ({
  isCreateModalOpen: false,
  createForm: { ...defaultForm },
  selectedAttendee: null,
  errors: null,

  openCreateModal: () => set({ isCreateModalOpen: true }),

  closeCreateModal: () => {
    set({ isCreateModalOpen: false, createForm: { ...defaultForm }, selectedAttendee: null });
  },

  setCreateFormField: (field, value) => {
    set((state) => ({
      createForm: { ...state.createForm, [field]: value },
    }));
  },

  setSelectedAttendee: async (id: number | null) => {
    if (id !== null) {
      const { startLoader, stopLoader } = useLoaderStore.getState();
      startLoader("fetchAttendee");
      try {
        const response = await api.get(`${endpoints.attendees.detail}${id}`);
        if (response.data.success) {
          const attendee = response.data.data;
          set({
            selectedAttendee: attendee,
            createForm: {
              id: attendee.id,
              name: attendee.name,
              email: attendee.email,
              phoneNumber: attendee.phoneNumber,
              clubName: attendee.clubName,
              membershipID: attendee.membershipID ? Number(attendee.membershipID) : (null as unknown as number),
              isVeg: attendee.isVeg,
              position: attendee.position || "",
              profilePicture: attendee.profilePic,
              paymentSlip: attendee.paymentSlip,
            },
            isCreateModalOpen: true,
          });
        }
      } catch (err: any) {
        set({ errors: err.response?.data?.error || "Failed to fetch attendee" });
        setTimeout(() => set({ errors: null }), 5000);
      } finally {
        stopLoader("fetchAttendee");
      }
    } else {
      set({ selectedAttendee: null, createForm: { ...defaultForm } });
    }
  },

  resetCreateForm: () => set({ createForm: { ...defaultForm }, selectedAttendee: null }),

  createAttendee: async (successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();
    const { createForm } = get();

    startLoader("createAttendee");

    const formData = new FormData();
    Object.entries(createForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    await api
      .post(endpoints.attendees.create, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        get().closeCreateModal();
        successCallback?.();
      })
      .catch((err) => {
        get().setError(err.response.data.error);
      })
      .finally(() => {
        stopLoader("createAttendee");
      });
  },

  updateAttendee: async (successCallback?: () => void) => {
    const { startLoader, stopLoader } = useLoaderStore.getState();
    const { createForm, selectedAttendee } = get();

    if (!selectedAttendee) return;

    startLoader("updateAttendee");

    const formData = new FormData();
    Object.entries(createForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });

    await api
      .post(endpoints.attendees.update + `${selectedAttendee.id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        get().closeCreateModal();
        successCallback?.();
      })
      .catch((err) => {
        get().setError(err.response?.data?.error || "Failed to update attendee");
      })
      .finally(() => {
        stopLoader("updateAttendee");
      });
  },

  setError: (errors: any) => {
    set({ errors });
    setTimeout(() => set({ errors: null }), 5000);
  },
}));
