import ContentLayout from "@/components/common/ContentLayout";
import DataTable from "@/components/common/DataTable";
import type { ColumnConfig } from "@/core/types/component/dataTable.type";
import endpoints from "@/core/app/endpoints";
import type { RoleDetail } from "shared-types";
import { useCallback, useMemo, useState } from "react";

export default function UserList() {
  const [count, setCount] = useState(0);
  const columns: ColumnConfig<RoleDetail>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Name",
        sortable: true,
        searchable: true,
        searchType: "text",
      },
      {
        key: "description",
        header: "Description",
        sortable: true,
        searchable: true,
        searchType: "text",
      },
      {
        key: "createdBy",
        header: "Create By",
      },
    ],
    []
  );

  const onFetch = useCallback((data: any) => {
    setCount(data.meta.total);
  }, []);

  return (
    <ContentLayout
      header={{ label: "Roles", count }}
      buttons={[
        {
          label: "Create User",
          onClick: () => alert("Open Create Modal"),
          className: "btn-primary",
        },
      ]}
    >
      <div className="p-1">
        <DataTable
          mode="api"
          apiUrl={endpoints.role.list}
          fetchCallback={onFetch}
          columns={columns}
          initialPageSize={10}
          heightOffset={15.5}
        />
      </div>
    </ContentLayout>
  );
}
