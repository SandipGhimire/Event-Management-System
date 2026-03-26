import Modal from "@/components/common/Modal";
import { useTaskStore } from "@/store/app/task.store";
import { useLoaderStore } from "@/store/app/loader.store";

export default function CreateTask() {
  const { isCreateModalOpen, closeCreateModal, createForm, setCreateFormField, createTask } = useTaskStore();
  const isLoading = useLoaderStore((s) => s.isLoading("createTask"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTask();
  };

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={closeCreateModal}
      title="Create New Task"
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
            disabled={isLoading || !createForm.name || !createForm.slug}
          >
            Create Task
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-y-4">
          {/* Name */}
          <div className="form-field field-required">
            <label htmlFor="createTask-name">Name</label>
            <input
              id="createTask-name"
              type="text"
              className="input-full"
              placeholder="Enter task name"
              value={createForm.name}
              onChange={(e) => setCreateFormField("name", e.target.value)}
            />
          </div>

          {/* Slug */}
          <div className="form-field field-required">
            <label htmlFor="createTask-slug">Slug</label>
            <input
              id="createTask-slug"
              type="text"
              className="input-full"
              placeholder="Enter unique slug"
              value={createForm.slug}
              onChange={(e) => setCreateFormField("slug", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="form-field">
            <label htmlFor="createTask-description">Description</label>
            <textarea
              id="createTask-description"
              className="input-full textarea-auto-grow"
              placeholder="Enter task description"
              value={createForm.description}
              onChange={(e) => setCreateFormField("description", e.target.value)}
            />
          </div>

          {/* Order */}
          <div className="form-field">
            <label htmlFor="createTask-order">Order</label>
            <input
              id="createTask-order"
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
              id="createTask-isActive"
              type="checkbox"
              checked={createForm.isActive}
              onChange={(e) => setCreateFormField("isActive", e.target.checked)}
            />
            <label htmlFor="createTask-isActive" className="mb-0 cursor-pointer">
              Is Active
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}
