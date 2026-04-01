import ContentLayout from "@/components/common/ContentLayout";
import DataTable from "@/components/common/DataTable";
import type { ColumnConfig } from "@/core/types/component/dataTable.type";
import endpoints from "@/core/app/endpoints";
import type { TaskDetail } from "shared-types";
import { useCallback, useMemo, useState, useRef } from "react";
import { Check, X, Edit2, Trash2 } from "lucide-react";
import { useTaskStore } from "@/store/app/task.store";
import CreateTask from "./CreateTask";

export default function Task() {
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
      {
        key: "id",
        header: "Actions",
        className: "w-24",
        render: (row) => (
          <div className="flex items-center gap-2">
            <button
              className="btn btn-icon btn-sm btn-outline-primary"
              onClick={() => handleEdit(row)}
              title="Edit Task"
            >
              <Edit2 size={16} />
            </button>
            <button
              className="btn btn-icon btn-sm btn-outline-danger"
              onClick={() => handleDelete(row)}
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete]
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
          initialPageSize={10}
          heightOffset={15.5}
        />
      </div>

      <CreateTask onSuccess={refreshTable} />
    </ContentLayout>
  );
}
