import ContentLayout from "@/components/common/ContentLayout";
import DataTable from "@/components/common/DataTable";
import type { ColumnConfig } from "@/core/types/component/dataTable.type";
import endpoints from "@/core/app/endpoints";
import type { SponsorDetail } from "shared-types";
import { useCallback, useMemo, useState } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useSponsorStore } from "@/store/app/sponsor.store";
import CreateSponsor from "./CreateSponsor";

export default function Sponsors() {
  const [count, setCount] = useState(0);
  const openCreateModal = useSponsorStore((s) => s.openCreateModal);

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
      header={{ label: "Sponsors", count }}
      buttons={[
        {
          label: "Create Sponsor",
          onClick: openCreateModal,
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

      <CreateSponsor />
    </ContentLayout>
  );
}
