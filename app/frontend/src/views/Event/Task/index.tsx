import ContentLayout from "@/components/common/ContentLayout";
import DataTable from "@/components/common/DataTable";
import type { ColumnConfig } from "@/core/types/component/dataTable.type";
import endpoints from "@/core/app/endpoints";
import type { TaskDetail } from "shared-types";
import { useCallback, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { useTaskStore } from "@/store/app/task.store";
import CreateTask from "./CreateTask";

export default function Attendees() {
  const [count, setCount] = useState(0);
  const openCreateModal = useTaskStore((s) => s.openCreateModal);

  const columns: ColumnConfig<TaskDetail>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Name",
        searchable: true,
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
      },
      {
        key: "isActive",
        header: "Is Active",
        render: (row) => (
          <>{row.isActive ? (
            <Check
              className="text-green-500 -my-2"
              size={18}
              strokeWidth={4}
            />
          ) : (
            <X
              className="text-red-500 -my-2"
              size={18}
              strokeWidth={4}
            />
          )}</>
        ),
      },
    ],
    []
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
          mode="api"
          apiUrl={endpoints.task.list}
          fetchCallback={onFetch}
          columns={columns}
          initialPageSize={10}
          heightOffset={15.5}
        />
      </div>

      <CreateTask />
    </ContentLayout>
  );
}
