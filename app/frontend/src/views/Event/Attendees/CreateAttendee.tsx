import Modal from "@/components/common/Modal";
import { useAttendeeStore } from "@/store/app/attendee.store";
import { useLoaderStore } from "@/store/app/loader.store";

export default function CreateAttendee() {
  const { isCreateModalOpen, closeCreateModal, createForm, setCreateFormField, createAttendee } = useAttendeeStore();
  const isLoading = useLoaderStore((s) => s.isLoading("createAttendee"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAttendee();
  };

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={closeCreateModal}
      title="Create New Attendee"
      size="md"
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={closeCreateModal} disabled={isLoading}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-primary ${isLoading ? "btn-loading" : ""}`}
            onClick={handleSubmit}
            disabled={isLoading || !createForm.name || !createForm.email}
          >
            Create Attendee
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          {/* Name */}
          <div className="form-field field-required md:col-span-2">
            <label htmlFor="createAttendee-name">Name</label>
            <input
              id="createAttendee-name"
              type="text"
              className="input-full"
              placeholder="Enter full name"
              value={createForm.name}
              onChange={(e) => setCreateFormField("name", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="form-field field-required">
            <label htmlFor="createAttendee-email">Email Address</label>
            <input
              id="createAttendee-email"
              type="email"
              className="input-full"
              placeholder="Enter email address"
              value={createForm.email}
              onChange={(e) => setCreateFormField("email", e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div className="form-field">
            <label htmlFor="createAttendee-phoneNumber">Phone Number</label>
            <input
              id="createAttendee-phoneNumber"
              type="tel"
              className="input-full"
              placeholder="Enter phone number"
              value={createForm.phoneNumber}
              onChange={(e) => setCreateFormField("phoneNumber", e.target.value)}
            />
          </div>

          {/* Club Name */}
          <div className="form-field">
            <label htmlFor="createAttendee-clubName">Club Name</label>
            <input
              id="createAttendee-clubName"
              type="text"
              className="input-full"
              placeholder="Enter club name"
              value={createForm.clubName}
              onChange={(e) => setCreateFormField("clubName", e.target.value)}
            />
          </div>

          {/* Membership ID */}
          <div className="form-field">
            <label htmlFor="createAttendee-membershipID">Membership ID</label>
            <input
              id="createAttendee-membershipID"
              type="text"
              className="input-full"
              placeholder="Enter membership ID"
              value={createForm.membershipID}
              onChange={(e) => setCreateFormField("membershipID", e.target.value)}
            />
          </div>

          {/* QR Code */}
          <div className="form-field md:col-span-2">
            <label htmlFor="createAttendee-qrCode">QR Code (Optional)</label>
            <input
              id="createAttendee-qrCode"
              type="text"
              className="input-full"
              placeholder="Enter QR Code or leave blank to auto-generate"
              value={createForm.qrCode}
              onChange={(e) => setCreateFormField("qrCode", e.target.value)}
            />
          </div>

          {/* Is Veg */}
          <div className="form-field md:col-span-2 flex-row items-center gap-2 mt-2">
            <input
              id="createAttendee-isVeg"
              type="checkbox"
              checked={createForm.isVeg}
              onChange={(e) => setCreateFormField("isVeg", e.target.checked)}
            />
            <label htmlFor="createAttendee-isVeg" className="mb-0 cursor-pointer">
              Is Vegetarian?
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}
