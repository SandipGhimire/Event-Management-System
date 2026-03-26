import ContentLayout from "@/components/common/ContentLayout";
import DataTable from "@/components/common/DataTable";
import type { ColumnConfig, DataTableHandle } from "@/core/types/component/dataTable.type";
import endpoints from "@/core/app/endpoints";
import type { AttendeesDetail } from "shared-types";
import { useCallback, useMemo, useState, useRef } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useAttendeeStore } from "@/store/app/attendee.store";
import CreateAttendee from "./CreateAttendee";
import { getBackendFile } from "@/core/utils/common.utils";

export default function Attendees() {
  const [count, setCount] = useState(0);
  const openCreateModal = useAttendeeStore((s) => s.openCreateModal);
  const tableRef = useRef<DataTableHandle>(null);

  const columns: ColumnConfig<AttendeesDetail>[] = useMemo(
    () => [
      {
        key: "profilePic",
        header: "",
        width: "50px",
        render: (row) => (
          <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center cursor-pointer">
            {row.profilePic ? (
              <img src={getBackendFile(row.profilePic)} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <DynamicIcon name="user" size={20} className="text-muted-foreground" />
            )}
          </div>
        ),
      },
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
          label: "Create Attendee",
          onClick: openCreateModal,
          className: "btn-primary",
        },
      ]}
    >
      <div className="p-1">
        <DataTable
          ref={tableRef}
          mode="api"
          apiUrl={endpoints.attendees.list}
          fetchCallback={onFetch}
          columns={columns}
          initialPageSize={10}
          heightOffset={15.5}
        />
      </div>

      <CreateAttendee onSuccess={() => tableRef.current?.refresh()} />
    </ContentLayout>
  );
}
