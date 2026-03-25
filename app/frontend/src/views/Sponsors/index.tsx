import ContentLayout from "@/components/common/ContentLayout";
import DataTable from "@/components/common/DataTable";
import type { ColumnConfig } from "@/core/types/component/dataTable.type";
import endpoints from "@/core/app/endpoints";
import type { SponsorDetail } from "shared-types";
import { useCallback, useMemo, useState } from "react";

export default function Sponsors() {
  const [count, setCount] = useState(0);
  const columns: ColumnConfig<SponsorDetail>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Name",
        searchable: true,
      },
      {
        key: "email",
        header: "Email Address",
        searchable: true,
        sortable: true,
      },
      {
        key: "phoneNumber",
        header: "Phone Number",
        searchable: true,
      },
      {
        key: "description",
        header: "Description",
      },
      {
        key: "contribution",
        header: "Contribution",
      },
    ],
    []
  );
  const onFetch = useCallback((data: any) => {
    setCount(data.meta.total);
  }, []);

  return (
    <ContentLayout
      header={{ label: "Sponsors", count }}
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
          apiUrl={endpoints.sponsor.list}
          fetchCallback={onFetch}
          columns={columns}
          initialPageSize={10}
          heightOffset={15.5}
        />
      </div>
    </ContentLayout>
  );
}
