import ContentLayout from "@/components/common/ContentLayout";
import DataTable from "@/components/common/DataTable";
import type { ColumnConfig } from "@/core/types/component/dataTable.type";
import endpoints from "@/core/app/endpoints";
import type { AttendeesDetail } from "shared-types";
import { useCallback, useMemo, useState } from "react";
import { DynamicIcon } from "lucide-react/dynamic";

export default function Attendees() {
  const [count, setCount] = useState(0);
  const columns: ColumnConfig<AttendeesDetail>[] = useMemo(
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
        key: "clubName",
        header: "Club Name",
        searchable: true,
      },
      {
        key: "isVeg",
        header: "Is Veg",
        render: (row) => (
          <DynamicIcon
            name={row.isVeg ? "check" : "x"}
            className={`${row.isVeg ? "text-green-500" : "text-red-500"} -my-2`}
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
      header={{ label: "Attendees", count }}
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
          apiUrl={endpoints.attendees.list}
          fetchCallback={onFetch}
          columns={columns}
          initialPageSize={10}
          heightOffset={15.5}
        />
      </div>
    </ContentLayout>
  );
}
