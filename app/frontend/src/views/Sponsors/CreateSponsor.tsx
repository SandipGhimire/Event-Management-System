import Modal from "@/components/common/Modal";
import { useSponsorStore } from "@/store/app/sponsor.store";
import { useLoaderStore } from "@/store/app/loader.store";

export default function CreateSponsor() {
  const { isCreateModalOpen, closeCreateModal, createForm, setCreateFormField, createSponsor } = useSponsorStore();
  const isLoading = useLoaderStore((s) => s.isLoading("createSponsor"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSponsor();
  };

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={closeCreateModal}
      title="Create New Sponsor"
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={closeCreateModal} disabled={isLoading}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-primary ${isLoading ? "btn-loading" : ""}`}
            onClick={handleSubmit}
            disabled={isLoading || !createForm.name}
          >
            Create Sponsor
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          {/* Name */}
          <div className="form-field field-required md:col-span-2">
            <label htmlFor="createSponsor-name">Name</label>
            <input
              id="createSponsor-name"
              type="text"
              className="input-full"
              placeholder="Enter sponsor name"
              value={createForm.name}
              onChange={(e) => setCreateFormField("name", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="form-field">
            <label htmlFor="createSponsor-email">Email Address</label>
            <input
              id="createSponsor-email"
              type="email"
              className="input-full"
              placeholder="Enter email address"
              value={createForm.email}
              onChange={(e) => setCreateFormField("email", e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div className="form-field">
            <label htmlFor="createSponsor-phoneNumber">Phone Number</label>
            <input
              id="createSponsor-phoneNumber"
              type="tel"
              className="input-full"
              placeholder="Enter phone number"
              value={createForm.phoneNumber}
              onChange={(e) => setCreateFormField("phoneNumber", e.target.value)}
            />
          </div>

          {/* Logo URL */}
          <div className="form-field md:col-span-2">
            <label htmlFor="createSponsor-logo">Logo URL</label>
            <input
              id="createSponsor-logo"
              type="url"
              className="input-full"
              placeholder="Enter logo URL"
              value={createForm.logo}
              onChange={(e) => setCreateFormField("logo", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="form-field md:col-span-2">
            <label htmlFor="createSponsor-description">Description</label>
            <textarea
              id="createSponsor-description"
              className="input-full textarea-auto-grow"
              placeholder="Enter description"
              value={createForm.description}
              onChange={(e) => setCreateFormField("description", e.target.value)}
            />
          </div>

          {/* Contribution */}
          <div className="form-field md:col-span-2">
            <label htmlFor="createSponsor-contribution">Contribution</label>
            <textarea
              id="createSponsor-contribution"
              className="input-full textarea-auto-grow"
              placeholder="Enter contribution details"
              value={createForm.contribution}
              onChange={(e) => setCreateFormField("contribution", e.target.value)}
            />
          </div>

          {/* Order */}
          <div className="form-field">
            <label htmlFor="createSponsor-order">Order</label>
            <input
              id="createSponsor-order"
              type="number"
              className="input-full"
              placeholder="Enter sort order (optional)"
              value={createForm.order}
              onChange={(e) => setCreateFormField("order", e.target.value)}
            />
          </div>

          {/* Is Active */}
          <div className="form-field flex-row items-center gap-2 mt-2">
            <input
              id="createSponsor-isActive"
              type="checkbox"
              checked={createForm.isActive}
              onChange={(e) => setCreateFormField("isActive", e.target.checked)}
            />
            <label htmlFor="createSponsor-isActive" className="mb-0 cursor-pointer">
              Is Active
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}
