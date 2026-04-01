import ContentLayout from "@/components/common/ContentLayout";
import DataTable from "@/components/common/DataTable";
import type { ColumnConfig } from "@/core/types/component/dataTable.type";
import endpoints from "@/core/app/endpoints";
import type { RoleDetail } from "shared-types";
import { useCallback, useMemo, useState } from "react";
import { useHasPermission } from "@/core/utils/permission.utils";
import { useRoleStore } from "@/store/app/role.store";
import RoleModal from "./RoleModal";
import { SquarePen, Trash2 } from "lucide-react";

export default function RoleList() {
  const { openModal, deleteRole } = useRoleStore();
  const canCreate = useHasPermission("role.create");
  const canUpdate = useHasPermission("role.update");
  const canDelete = useHasPermission("role.delete");

  const [count, setCount] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const columns: ColumnConfig<RoleDetail>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Role Name",
        sortable: true,
        searchable: true,
        searchType: "text",
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-bold text-text-primary uppercase tracking-wider">{row.name}</span>
            <span className="text-[10px] text-text-secondary opacity-70">
              {row.permissions?.length || 0} permissions
            </span>
          </div>
        ),
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
        header: "Created By",
        render: (row) => <div className="text-sm font-medium">{row.createdBy}</div>,
      },
    ],
    []
  );

  const tableActions = useMemo(
    () => [
      {
        label: "Edit Role",
        icon: SquarePen,
        onClick: (row: RoleDetail) => openModal("edit", row),
        hidden: () => !canUpdate,
      },
      {
        label: "Delete Role",
        icon: Trash2,
        onClick: (row: RoleDetail) => deleteRole(row.id, () => setRefresh((c) => c + 1)),
        className: "text-danger hover:bg-danger/10",
        hidden: () => !canDelete,
      },
    ],
    [canUpdate, canDelete, openModal, deleteRole]
  );

  const onFetch = useCallback((data: any) => {
    setCount(data.meta.total);
  }, []);

  return (
    <ContentLayout
      header={{ label: "Roles", count }}
      buttons={[
        {
          label: "Create Role",
          onClick: () => openModal("create"),
          className: "btn-primary",
          isVisible: canCreate,
        },
      ]}
    >
      <div className="p-1">
        <DataTable
          key={refresh}
          mode="api"
          apiUrl={endpoints.role.list}
          fetchCallback={onFetch}
          columns={columns}
          actions={tableActions}
          initialPageSize={10}
          heightOffset={15.5}
        />
      </div>

      <RoleModal successCallback={() => setRefresh((c) => c + 1)} />
    </ContentLayout>
  );
}
