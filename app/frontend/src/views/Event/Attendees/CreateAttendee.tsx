import Modal from "@/components/common/Modal";
import { useAttendeeStore } from "@/store/app/attendee.store";
import { useLoaderStore } from "@/store/app/loader.store";
import FileUpload from "@/components/common/FileUpload";
import { getBackendFile } from "@/core/utils/common.utils";

interface CreateAttendeeProps {
  onSuccess?: () => void;
}

export default function CreateAttendee({ onSuccess }: CreateAttendeeProps) {
  const {
    isCreateModalOpen,
    closeCreateModal,
    createForm,
    setCreateFormField,
    createAttendee,
    updateAttendee,
    selectedAttendee,
    errors,
  } = useAttendeeStore();
  const isLoading = useLoaderStore((s) => s.isLoading("createAttendee") || s.isLoading("updateAttendee"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAttendee) {
      updateAttendee(onSuccess);
    } else {
      createAttendee(onSuccess);
    }
  };

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={closeCreateModal}
      title={selectedAttendee ? "Update Attendee" : "Create New Attendee"}
      size="md"
      footer={
        <>
          <button type="button" className="btn btn-outline-danger" onClick={closeCreateModal} disabled={isLoading}>
            Cancel
          </button>
          <button type="button" className={`btn btn-primary ${isLoading ? "btn-loading" : ""}`} onClick={handleSubmit}>
            {selectedAttendee ? "Update Attendee" : "Create Attendee"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-2">
          {/* Profile Picture & Payment Slip */}
          <FileUpload
            id="createAttendee-profilePicture"
            label="Profile Picture"
            accept="image/*"
            onChange={(file) => setCreateFormField("profilePicture", file)}
            previewUrl={
              createForm.profilePicture instanceof File
                ? undefined
                : createForm.profilePicture
                  ? getBackendFile(createForm.profilePicture)
                  : undefined
            }
            error={errors?.profilePicture?.[0]}
          />

          <FileUpload
            id="createAttendee-paymentSlip"
            label="Payment Slip"
            accept="image/*"
            onChange={(file) => setCreateFormField("paymentSlip", file)}
            previewUrl={
              createForm.paymentSlip instanceof File
                ? undefined
                : createForm.paymentSlip
                  ? getBackendFile(createForm.paymentSlip)
                  : undefined
            }
            error={errors?.paymentSlip?.[0]}
          />

          {/* Name */}
          <div className="form-field field-required">
            <label htmlFor="createAttendee-name">Name</label>
            <input
              id="createAttendee-name"
              type="text"
              className={`input-full ${errors?.name?.[0] ? "input-error" : ""}`}
              placeholder="Enter full name"
              value={createForm.name}
              onChange={(e) => setCreateFormField("name", e.target.value)}
            />
            {errors?.name?.[0] && <span className="field-error">{errors.name?.[0]}</span>}
          </div>

          {/* Email */}
          <div className="form-field field-required">
            <label htmlFor="createAttendee-email">Email Address</label>
            <input
              id="createAttendee-email"
              type="email"
              className={`input-full ${errors?.email?.[0] ? "input-error" : ""}`}
              placeholder="Enter email address"
              value={createForm.email}
              onChange={(e) => setCreateFormField("email", e.target.value)}
            />
            {errors?.email?.[0] && <span className="field-error">{errors.email?.[0]}</span>}
          </div>

          {/* Phone Number */}
          <div className="form-field field-required">
            <label htmlFor="createAttendee-phoneNumber">Phone Number</label>
            <input
              id="createAttendee-phoneNumber"
              type="number"
              className={`input-full ${errors?.phoneNumber?.[0] ? "input-error" : ""}`}
              placeholder="Enter phone number"
              value={createForm.phoneNumber}
              onChange={(e) => setCreateFormField("phoneNumber", e.target.value)}
            />
            {errors?.phoneNumber?.[0] && <span className="field-error">{errors.phoneNumber?.[0]}</span>}
          </div>

          {/* Club Name */}
          <div className="form-field col-span-2 field-required">
            <label htmlFor="createAttendee-clubName">Club Name</label>
            <input
              id="createAttendee-clubName"
              type="text"
              className={`input-full ${errors?.clubName?.[0] ? "input-error" : ""}`}
              placeholder="Enter club name"
              value={createForm.clubName}
              onChange={(e) => setCreateFormField("clubName", e.target.value)}
            />
            {errors?.clubName?.[0] && <span className="field-error">{errors.clubName?.[0]}</span>}
          </div>

          {/* Position */}
          <div className="form-field field-required">
            <label htmlFor="createAttendee-position">Position</label>
            <input
              id="createAttendee-position"
              type="text"
              className={`input-full ${errors?.position?.[0] ? "input-error" : ""}`}
              placeholder="Enter position"
              value={createForm.position}
              onChange={(e) => setCreateFormField("position", e.target.value)}
            />
            {errors?.position?.[0] && <span className="field-error">{errors.position?.[0]}</span>}
          </div>

          {/* Membership ID */}
          <div className="form-field">
            <label htmlFor="createAttendee-membershipID">Membership ID</label>
            <input
              id="createAttendee-membershipID"
              type="number"
              className={`input-full ${errors?.membershipID?.[0] ? "input-error" : ""}`}
              placeholder="Enter membership ID"
              value={createForm.membershipID}
              onChange={(e) => setCreateFormField("membershipID", Number(e.target.value))}
            />
            {errors?.membershipID?.[0] && <span className="field-error">{errors.membershipID?.[0]}</span>}
          </div>

          {/* Is Veg */}
          <div className="form-field flex-row! my-auto">
            <input
              id="createAttendee-isVeg"
              type="checkbox"
              checked={createForm.isVeg}
              onChange={(e) => setCreateFormField("isVeg", e.target.checked)}
            />
            <label htmlFor="createAttendee-isVeg">Is Vegetarian?</label>
            {errors?.isVeg?.[0] && <span className="field-error">{errors.isVeg?.[0]}</span>}
          </div>
        </div>
      </form>
    </Modal>
  );
}
