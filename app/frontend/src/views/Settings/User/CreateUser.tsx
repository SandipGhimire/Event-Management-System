import Modal from "@/components/common/Modal";
import { useUserStore } from "@/store/app/user.store";
import { useLoaderStore } from "@/store/app/loader.store";
import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";

interface CreateUserProps {
  successCallback?: () => void;
}

export default function CreateUser({ successCallback }: CreateUserProps) {
  const { isModalOpen, closeModal, form, setFormField, saveUser, mode } = useUserStore();
  const isLoading = useLoaderStore((s) => s.isLoading("saveUser"));
  const [roles, setRoles] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    if (isModalOpen) {
      api.get(endpoints.role.list, { params: { pageSize: 100 } }).then((res) => {
        const roleData = res.data.data.data.map((r: any) => ({
          value: r.id,
          label: r.name,
        }));
        setRoles(roleData);
      });
    }
  }, [isModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveUser(successCallback);
  };

  const isFormValid = useMemo(() => {
    const commonFields = !!(form.firstName && form.lastName && form.email && form.username && form.roleIds.length > 0);
    if (mode === "create") {
      return (
        commonFields &&
        !!(form.password && form.confirmPassword && form.password === form.confirmPassword)
      );
    }
    return commonFields;
  }, [form, mode]);

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: "var(--input-bg)",
      borderColor: "var(--border-color)",
      borderRadius: "0.5rem",
      padding: "2px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "var(--primary-color)",
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "var(--background-color)",
      border: "1px solid var(--border-color)",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      zIndex: 50,
    }),
    option: (base: any, state: { isFocused: boolean; isSelected: boolean }) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "var(--primary-color)"
        : state.isFocused
          ? "var(--primary-light)"
          : "transparent",
      color: state.isSelected ? "white" : "var(--text-primary)",
      cursor: "pointer",
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "var(--primary-color)",
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: "white",
      fontWeight: "500",
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: "white",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: "white",
      },
    }),
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={mode === "create" ? "Create New User" : "Edit User"}
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={closeModal} disabled={isLoading}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-primary ${isLoading ? "btn-loading" : ""}`}
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid}
          >
            {mode === "create" ? "Create User" : "Update User"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          <div className="form-field field-required">
            <label htmlFor="user-firstName">First Name</label>
            <input
              id="user-firstName"
              type="text"
              className="input-full"
              placeholder="Enter first name"
              value={form.firstName}
              onChange={(e) => setFormField("firstName", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="user-middleName">Middle Name</label>
            <input
              id="user-middleName"
              type="text"
              className="input-full"
              placeholder="Enter middle name"
              value={form.middleName}
              onChange={(e) => setFormField("middleName", e.target.value)}
            />
          </div>

          <div className="form-field field-required">
            <label htmlFor="user-lastName">Last Name</label>
            <input
              id="user-lastName"
              type="text"
              className="input-full"
              placeholder="Enter last name"
              value={form.lastName}
              onChange={(e) => setFormField("lastName", e.target.value)}
            />
          </div>

          <div className="form-field field-required">
            <label htmlFor="user-email">Email Address</label>
            <input
              id="user-email"
              type="email"
              className="input-full"
              placeholder="Enter email address"
              value={form.email}
              onChange={(e) => setFormField("email", e.target.value)}
            />
          </div>

          <div className="form-field field-required">
            <label htmlFor="user-username">Username</label>
            <input
              id="user-username"
              type="text"
              className="input-full"
              placeholder="Enter username"
              value={form.username}
              onChange={(e) => setFormField("username", e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="user-phoneNumber">Phone Number</label>
            <input
              id="user-phoneNumber"
              type="tel"
              className="input-full"
              placeholder="Enter phone number"
              value={form.phoneNumber}
              onChange={(e) => setFormField("phoneNumber", e.target.value)}
            />
          </div>

          <div className="form-field field-required col-span-full">
            <label>Assigned Roles</label>
            <Select
              isMulti
              options={roles}
              styles={customSelectStyles}
              value={roles.filter((r) => form.roleIds.includes(r.value))}
              onChange={(selected) => {
                setFormField(
                  "roleIds",
                  (selected as any[]).map((s) => s.value)
                );
              }}
              placeholder="Select roles..."
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <div className="col-span-full border-t border-border mt-2 pt-4">
            <h4 className="text-sm font-semibold mb-3">
              {mode === "create" ? "Set Password" : "Change Password (Optional)"}
            </h4>
          </div>

          <div className={`form-field ${mode === "create" ? "field-required" : ""}`}>
            <label htmlFor="user-password">Password</label>
            <input
              id="user-password"
              type="password"
              className="input-full"
              placeholder={mode === "create" ? "Enter password" : "Leave blank to keep current"}
              value={form.password || ""}
              onChange={(e) => setFormField("password", e.target.value)}
            />
          </div>

          <div className={`form-field ${mode === "create" ? "field-required" : ""}`}>
            <label htmlFor="user-confirmPassword">Confirm Password</label>
            <input
              id="user-confirmPassword"
              type="password"
              className={`input-full ${form.confirmPassword && form.password !== form.confirmPassword ? "input-error" : ""}`}
              placeholder="Confirm password"
              value={form.confirmPassword || ""}
              onChange={(e) => setFormField("confirmPassword", e.target.value)}
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <span className="field-error">Passwords do not match</span>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
