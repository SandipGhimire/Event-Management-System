import Modal from "@/components/common/Modal";
import { useSponsorStore } from "@/store/app/sponsor.store";
import { useLoaderStore } from "@/store/app/loader.store";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getBackendFile } from "@/core/utils/common.utils";

interface CreateSponsorProps {
  onSuccess?: () => void;
}

export default function CreateSponsor({ onSuccess }: CreateSponsorProps) {
  const {
    isCreateModalOpen,
    closeCreateModal,
    createForm,
    setCreateFormField,
    setLinkField,
    addLink,
    removeLink,
    createSponsor,
    updateSponsor,
    selectedSponsor,
    errors,
  } = useSponsorStore();

  const isEdit = !!selectedSponsor;
  const isLoading = useLoaderStore((s) => s.isLoading(isEdit ? "updateSponsor" : "createSponsor"));
  const isFetching = useLoaderStore((s) => s.isLoading("fetchSponsor"));
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      await updateSponsor(onSuccess);
    } else {
      await createSponsor(onSuccess);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCreateFormField("logo", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    if (!isCreateModalOpen && previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [isCreateModalOpen, previewUrl]);

  useEffect(() => {
    if (isCreateModalOpen && !selectedSponsor) {
      setPreviewUrl(null);
    }
  }, [isCreateModalOpen, selectedSponsor]);

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={closeCreateModal}
      title={isFetching ? "Loading..." : isEdit ? "Edit Sponsor" : "Create New Sponsor"}
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-outline-secondary" onClick={closeCreateModal} disabled={isLoading}>
            Cancel
          </button>
          <button type="button" className={`btn btn-primary ${isLoading ? "btn-loading" : ""}`} onClick={handleSubmit}>
            {isEdit ? "Update Sponsor" : "Create Sponsor"}
          </button>
        </>
      }
    >
      {isFetching ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
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
              {errors?.name?.[0] && <span className="field-error">{errors.name?.[0]}</span>}
            </div>

            {/* Email */}
            <div className="form-field field-required">
              <label htmlFor="createSponsor-email">Email Address</label>
              <input
                id="createSponsor-email"
                type="email"
                className="input-full"
                placeholder="Enter email address"
                value={createForm.email}
                onChange={(e) => setCreateFormField("email", e.target.value)}
              />
              {errors?.email?.[0] && <span className="field-error">{errors.email?.[0]}</span>}
            </div>

            {/* Phone Number */}
            <div className="form-field field-required">
              <label htmlFor="createSponsor-phoneNumber">Phone Number</label>
              <input
                id="createSponsor-phoneNumber"
                type="tel"
                className="input-full"
                placeholder="Enter phone number"
                value={createForm.phoneNumber}
                onChange={(e) => setCreateFormField("phoneNumber", e.target.value)}
              />
              {errors?.phoneNumber?.[0] && <span className="field-error">{errors.phoneNumber?.[0]}</span>}
            </div>

            {/* Logo Upload */}
            <div className="form-field field-required md:col-span-2">
              <label htmlFor="createSponsor-logo">Logo</label>
              <div className="flex items-center gap-4">
                <input
                  id="createSponsor-logo"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                <label htmlFor="createSponsor-logo" className="btn btn-outline-primary cursor-pointer mb-0">
                  Choose Logo
                </label>

                {(previewUrl || createForm.logo) && (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border border-border bg-muted/20">
                    <img
                      src={previewUrl || (typeof createForm.logo === "string" ? getBackendFile(createForm.logo) : "")}
                      alt="Logo Preview"
                      className="w-full h-full object-contain"
                    />
                    {previewUrl && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-[10px] text-white font-medium text-center">New</span>
                      </div>
                    )}
                  </div>
                )}
                {createForm.logo instanceof File && (
                  <span className="text-xs text-text-secondary truncate max-w-[150px]">{createForm.logo.name}</span>
                )}
              </div>
              {errors?.logo?.[0] && <span className="field-error">{errors.logo?.[0]}</span>}
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

            {/* Sponsor Links Section */}
            <div className="md:col-span-2 mt-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-semibold text-text-primary">Sponsor Links</h5>
                <button type="button" className="btn btn-sm btn-outline-primary py-1" onClick={addLink}>
                  <Plus size={14} className="mr-1" /> Add Link
                </button>
              </div>

              <div className="space-y-3">
                {createForm.links.map((link, index) => (
                  <div
                    key={index}
                    className="sponsor-link-row animate-fade-in border border-border rounded p-2 flex items-center gap-3"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="form-field mb-0">
                        <input
                          type="text"
                          className="input-full input-sm"
                          placeholder="Label (e.g. Website)"
                          value={link.label}
                          onChange={(e) => setLinkField(index, "label", e.target.value)}
                        />
                      </div>
                      <div className="form-field mb-0">
                        <input
                          type="url"
                          className="input-full input-sm"
                          placeholder="URL (e.g. https://...)"
                          value={link.url}
                          onChange={(e) => setLinkField(index, "url", e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-icon btn-sm text-red-500"
                      onClick={() => removeLink(index)}
                      title="Remove link"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {createForm.links.length === 0 && (
                  <div className="p-8 text-center border border-dashed border-border rounded-lg bg-muted/30">
                    <p className="text-sm text-text-secondary italic">No links added. Click "Add Link" to start.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order */}
            <div className="form-field mt-4">
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
            <div className="form-field flex-row items-center gap-2 mt-4 pt-6">
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
      )}
    </Modal>
  );
}
