import ContentLayout from "@/components/common/ContentLayout";
import DataTable from "@/components/common/DataTable";
import type { ColumnConfig } from "@/core/types/component/dataTable.type";
import endpoints from "@/core/app/endpoints";
import type { TaskDetail } from "shared-types";
import { useCallback, useMemo, useState } from "react";
import { DynamicIcon } from "lucide-react/dynamic";

export default function Attendees() {
  const [count, setCount] = useState(0);
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
          <DynamicIcon
            name={row.isActive ? "check" : "x"}
            className={`${row.isActive ? "text-green-500" : "text-red-500"} -my-2`}
            size={18}
            strokeWidth={4}
          />
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
          onClick: () => alert("Open Create Modal"),
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
    </ContentLayout>
  );
}
