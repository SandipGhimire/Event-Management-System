import Modal from "@/components/common/Modal";
import { useUserStore } from "@/store/app/user.store";
import { useLoaderStore } from "@/store/app/loader.store";

export default function CreateUser() {
  const { isCreateModalOpen, closeCreateModal, createForm, setCreateFormField, createUser } = useUserStore();
  const isLoading = useLoaderStore((s) => s.isLoading("createUser"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser();
  };

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={closeCreateModal}
      title="Create New User"
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
            disabled={
              isLoading ||
              !createForm.firstName ||
              !createForm.lastName ||
              !createForm.email ||
              !createForm.username ||
              !createForm.password ||
              !createForm.confirmPassword ||
              createForm.password !== createForm.confirmPassword
            }
          >
            Create User
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          {/* First Name */}
          <div className="form-field field-required">
            <label htmlFor="create-firstName">First Name</label>
            <input
              id="create-firstName"
              type="text"
              className="input-full"
              placeholder="Enter first name"
              value={createForm.firstName}
              onChange={(e) => setCreateFormField("firstName", e.target.value)}
            />
          </div>

          {/* Middle Name */}
          <div className="form-field">
            <label htmlFor="create-middleName">Middle Name</label>
            <input
              id="create-middleName"
              type="text"
              className="input-full"
              placeholder="Enter middle name"
              value={createForm.middleName}
              onChange={(e) => setCreateFormField("middleName", e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div className="form-field field-required">
            <label htmlFor="create-lastName">Last Name</label>
            <input
              id="create-lastName"
              type="text"
              className="input-full"
              placeholder="Enter last name"
              value={createForm.lastName}
              onChange={(e) => setCreateFormField("lastName", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="form-field field-required">
            <label htmlFor="create-email">Email Address</label>
            <input
              id="create-email"
              type="email"
              className="input-full"
              placeholder="Enter email address"
              value={createForm.email}
              onChange={(e) => setCreateFormField("email", e.target.value)}
            />
          </div>

          {/* Username */}
          <div className="form-field field-required">
            <label htmlFor="create-username">Username</label>
            <input
              id="create-username"
              type="text"
              className="input-full"
              placeholder="Enter username"
              value={createForm.username}
              onChange={(e) => setCreateFormField("username", e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div className="form-field">
            <label htmlFor="create-phoneNumber">Phone Number</label>
            <input
              id="create-phoneNumber"
              type="tel"
              className="input-full"
              placeholder="Enter phone number"
              value={createForm.phoneNumber}
              onChange={(e) => setCreateFormField("phoneNumber", e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-field field-required">
            <label htmlFor="create-password">Password</label>
            <input
              id="create-password"
              type="password"
              className="input-full"
              placeholder="Enter password"
              value={createForm.password}
              onChange={(e) => setCreateFormField("password", e.target.value)}
            />
          </div>

          {/* Confirm Password */}
          <div className="form-field field-required">
            <label htmlFor="create-confirmPassword">Confirm Password</label>
            <input
              id="create-confirmPassword"
              type="password"
              className={`input-full ${createForm.confirmPassword && createForm.password !== createForm.confirmPassword ? "input-error" : ""}`}
              placeholder="Confirm password"
              value={createForm.confirmPassword}
              onChange={(e) => setCreateFormField("confirmPassword", e.target.value)}
            />
            {createForm.confirmPassword && createForm.password !== createForm.confirmPassword && (
              <span className="field-error">Passwords do not match</span>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
