import Modal from "@/components/common/Modal";
import { useTaskStore } from "@/store/app/task.store";
import { useLoaderStore } from "@/store/app/loader.store";

interface CreateTaskProps {
  onSuccess?: () => void;
}

export default function CreateTask({ onSuccess }: CreateTaskProps) {
  const { isCreateModalOpen, closeCreateModal, createForm, setCreateFormField, createTask, updateTask, selectedTask } =
    useTaskStore();

  const isEdit = !!selectedTask;
  const isLoading = useLoaderStore((s) => s.isLoading(isEdit ? "updateTask" : "createTask"));
  const isFetching = useLoaderStore((s) => s.isLoading("fetchTask"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      await updateTask(onSuccess);
    } else {
      await createTask(onSuccess);
    }
  };

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onClose={closeCreateModal}
      title={isFetching ? "Loading..." : isEdit ? "Edit Task" : "Create New Task"}
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
            disabled={isLoading || isFetching || !createForm.name || !createForm.slug}
          >
            {isEdit ? "Update Task" : "Create Task"}
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
      )}
    </Modal>
  );
}
