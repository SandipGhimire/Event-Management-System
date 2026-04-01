import ContentLayout from "@/components/common/ContentLayout";
import DataTable from "@/components/common/DataTable";
import type { ColumnConfig } from "@/core/types/component/dataTable.type";
import endpoints from "@/core/app/endpoints";
import type { TaskDetail } from "shared-types";
import { useCallback, useMemo, useState, useRef } from "react";
import { Check, X, Edit2, Trash2 } from "lucide-react";
import { useTaskStore } from "@/store/app/task.store";
import CreateTask from "./CreateTask";
import { useHasPermission } from "@/core/utils/permission.utils";

export default function Task() {
  const canCreate = useHasPermission("task.create");
  const canUpdate = useHasPermission("task.update");
  const canDelete = useHasPermission("task.delete");

  const [count, setCount] = useState(0);
  const { openCreateModal, setSelectedTask, deleteTask } = useTaskStore();
  const tableRef = useRef<any>(null);

  const refreshTable = useCallback(() => {
    tableRef.current?.refresh();
  }, []);

  const handleEdit = useCallback(
    (task: TaskDetail) => {
      setSelectedTask(task.id);
    },
    [setSelectedTask]
  );

  const handleDelete = useCallback(
    async (task: TaskDetail) => {
      await deleteTask(task.id, refreshTable);
    },
    [deleteTask, refreshTable]
  );

  const columns: ColumnConfig<TaskDetail>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Name",
        searchable: true,
        sortable: true,
      },
      {
        key: "description",
        header: "Description",
        searchable: true,
        sortable: true,
      },
      {
        key: "slug",
        header: "Slug",
        searchable: true,
        sortable: true,
      },
      {
        key: "isActive",
        header: "Is Active",
        render: (row) => (
          <>
            {row.isActive ? (
              <Check className="text-green-500 -my-2" size={18} strokeWidth={4} />
            ) : (
              <X className="text-red-500 -my-2" size={18} strokeWidth={4} />
            )}
          </>
        ),
      },
    ],
    []
  );

  const tableActions = useMemo(
    () => [
      {
        label: "Edit",
        icon: Edit2,
        onClick: (row: TaskDetail) => handleEdit(row),
        hidden: () => !canUpdate,
      },
      {
        label: "Delete",
        icon: Trash2,
        onClick: (row: TaskDetail) => handleDelete(row),
        className: "text-danger hover:bg-danger/10",
        hidden: () => !canDelete,
      },
    ],
    [handleEdit, handleDelete, canUpdate, canDelete]
  );
  
  const onFetch = useCallback((data: any) => {
    setCount(data.meta.total);
  }, []);

  return (
    <ContentLayout
      header={{ label: "Task", count }}
      buttons={[
        {
          label: "Create Task",
          onClick: openCreateModal,
          className: "btn-primary",
          isVisible: canCreate,
        },
      ]}
    >
      <div className="p-1">
        <DataTable
          ref={tableRef}
          mode="api"
          apiUrl={endpoints.task.list}
          fetchCallback={onFetch}
          columns={columns}
          actions={tableActions}
          initialPageSize={10}
          heightOffset={15.5}
        />
      </div>

      <CreateTask onSuccess={refreshTable} />
    </ContentLayout>
  );
}
