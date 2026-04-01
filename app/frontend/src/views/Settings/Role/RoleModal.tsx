import Modal from "@/components/common/Modal";
import { useRoleStore } from "@/store/app/role.store";
import { useLoaderStore } from "@/store/app/loader.store";
import { useEffect, useState, useMemo } from "react";
import api from "@/core/app/api";
import endpoints from "@/core/app/endpoints";
import { Check, ShieldCheck } from "lucide-react";

interface RoleModalProps {
  successCallback?: () => void;
}

export default function RoleModal({ successCallback }: RoleModalProps) {
  const { isModalOpen, closeModal, form, setFormField, saveRole, mode } = useRoleStore();
  const isLoading = useLoaderStore((s) => s.isLoading("saveRole"));
  const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);

  useEffect(() => {
    if (isModalOpen) {
      api.get(endpoints.role.permissions).then((res) => {
        // Fix: accessing res.data.data
        setAvailablePermissions(res.data.data || []);
      });
    }
  }, [isModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveRole(successCallback);
  };

  const handlePermissionToggle = (key: string) => {
    const newKeys = form.permissionKeys.includes(key)
      ? form.permissionKeys.filter((k) => k !== key)
      : [...form.permissionKeys, key];
    setFormField("permissionKeys", newKeys);
  };

  const toggleModulePermissions = (perms: any[], isAllSelected: boolean) => {
    const moduleKeys = perms.map((p) => p.key);
    if (isAllSelected) {
      // Remove all module permissions
      setFormField(
        "permissionKeys",
        form.permissionKeys.filter((k) => !moduleKeys.includes(k))
      );
    } else {
      // Add all module permissions
      setFormField("permissionKeys", [...new Set([...form.permissionKeys, ...moduleKeys])]);
    }
  };

  const isFormValid = useMemo(() => {
    return !!(form.name && form.permissionKeys.length > 0);
  }, [form]);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, any[]> = {};
    if (Array.isArray(availablePermissions)) {
      availablePermissions.forEach((p) => {
        const prefix = p.key.split(".")[0];
        if (!groups[prefix]) groups[prefix] = [];
        groups[prefix].push(p);
      });
    }
    return groups;
  }, [availablePermissions]);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-primary" size={20} />
          <span>{mode === "create" ? "Create System Role" : "Edit Role Permissions"}</span>
        </div>
      }
      size="xl"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <button
            type="button"
            className="btn btn-ghost text-text-secondary hover:bg-bg-hover px-6"
            onClick={closeModal}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn-primary min-w-[120px] ${isLoading ? "btn-loading" : ""}`}
            onClick={handleSubmit}
            disabled={isLoading || !isFormValid}
          >
            {mode === "create" ? "Create Role" : "Apply Changes"}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 py-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="form-field field-required">
              <label htmlFor="role-name" className="text-sm font-semibold text-text-primary">
                Role Name
              </label>
              <input
                id="role-name"
                type="text"
                className="input-full bg-bg-secondary/50 border-border focus:border-primary transition-all duration-200"
                placeholder="e.g. Moderator"
                value={form.name}
                onChange={(e) => setFormField("name", e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="role-description" className="text-sm font-semibold text-text-primary">
                Description
              </label>
              <textarea
                id="role-description"
                className="input-full bg-bg-secondary/50 border-border focus:border-primary transition-all duration-200"
                placeholder="Responsibilities of this role"
                rows={4}
                value={form.description}
                onChange={(e) => setFormField("description", e.target.value)}
              />
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <p className="text-[12px] text-primary leading-relaxed">
                <span className="font-bold block mb-1">System Security Tip:</span>
                Select only the permissions necessary for the role. This ensures a principle of least privilege is
                maintained.
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-baseline justify-between mb-4">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">Access Entitlements</h4>
              <span className="text-[11px] font-medium px-2 py-0.5 bg-bg-secondary rounded-full text-text-secondary border border-border">
                {form.permissionKeys.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(groupedPermissions).map(([module, perms]) => {
                const isAllSelected = perms.every((p) => form.permissionKeys.includes(p.key));
                const isSomeSelected = perms.some((p) => form.permissionKeys.includes(p.key));

                return (
                  <div
                    key={module}
                    className={`rounded-2xl border transition-all duration-300 ${
                      isSomeSelected ? "border-primary/30 bg-bg-primary" : "border-border/60 bg-bg-secondary/30"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between px-4 py-3 border-b transition-colors ${
                        isSomeSelected ? "border-primary/10 bg-primary/5" : "border-border/60"
                      }`}
                    >
                      <h5 className="text-[11px] font-extrabold uppercase text-text-primary tracking-widest">
                        {module}
                      </h5>
                      <button
                        type="button"
                        onClick={() => toggleModulePermissions(perms, isAllSelected)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all duration-200 ${
                          isAllSelected ? "text-danger hover:bg-danger/10" : "text-primary hover:bg-primary/10"
                        }`}
                      >
                        {isAllSelected ? "Deselect All" : "Select All"}
                      </button>
                    </div>

                    <div className="p-3 space-y-1.5">
                      {perms.map((p) => {
                        const isSelected = form.permissionKeys.includes(p.key);
                        return (
                          <label
                            key={p.key}
                            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 group ${
                              isSelected ? "bg-primary/10" : "hover:bg-bg-hover"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                                isSelected ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"
                              }`}
                            >
                              {isSelected && <Check size={10} className="text-white stroke-[3px]" />}
                            </div>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isSelected}
                              onChange={() => handlePermissionToggle(p.key)}
                            />
                            <div className="flex flex-col">
                              <span
                                className={`text-[11px] font-bold leading-none mb-1 transition-colors ${
                                  isSelected ? "text-primary" : "text-text-primary"
                                }`}
                              >
                                {p.name}
                              </span>
                              <span className="text-[9px] text-text-secondary opacity-60 font-mono italic">
                                {p.key}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
