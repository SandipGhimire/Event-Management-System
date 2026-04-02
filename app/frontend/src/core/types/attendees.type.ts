import type { CreateAttendeePayload, AttendeesDetail } from "shared-types";

export interface AttendeeState {
  isCreateModalOpen: boolean;
  createForm: CreateAttendeePayload & { id?: number };
  selectedAttendee: AttendeesDetail | null;
  errors: any;

  openCreateModal: () => void;
  closeCreateModal: () => void;
  setCreateFormField: <K extends keyof CreateAttendeePayload>(field: K, value: CreateAttendeePayload[K]) => void;
  resetCreateForm: () => void;
  createAttendee: (successCallback?: () => void) => Promise<void>;
  updateAttendee: (successCallback?: () => void) => Promise<void>;
  setSelectedAttendee: (id: number | null) => Promise<void>;

  setError: (errors: any) => void;
}
