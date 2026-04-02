import ContentLayout from "@/components/common/ContentLayout";
import DataTable from "@/components/common/DataTable";
import type { ColumnConfig, DataTableHandle } from "@/core/types/component/dataTable.type";
import endpoints from "@/core/app/endpoints";
import type { SponsorDetail } from "shared-types";
import { useCallback, useMemo, useState, useRef } from "react";
import { Image, Check, X, Pencil } from "lucide-react";
import { useSponsorStore } from "@/store/app/sponsor.store";
import SponsorModal from "./SponsorModal";
import { getBackendFile } from "@/core/utils/common.utils";
import ImageViewer from "@/components/common/ImageViewer";
import { useHasPermission } from "@/core/utils/permission.utils";

export default function Sponsors() {
  const canCreate = useHasPermission("sponsor.create");
  const canUpdate = useHasPermission("sponsor.update");

  const [count, setCount] = useState(0);
  const openCreateModal = useSponsorStore((s) => s.openCreateModal);
  const setSelectedSponsor = useSponsorStore((s) => s.setSelectedSponsor);
  const tableRef = useRef<DataTableHandle>(null);

  const [viewerConfig, setViewerConfig] = useState<{ isOpen: boolean; src: string; title: string }>({
    isOpen: false,
    src: "",
    title: "",
  });

  const closeViewer = () => setViewerConfig((prev) => ({ ...prev, isOpen: false }));
  const openViewer = (src: string, title: string) => setViewerConfig({ isOpen: true, src, title });

  const columns: ColumnConfig<SponsorDetail>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Name",
        searchable: true,
        render: (row) => (
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded overflow-hidden border border-border bg-muted flex items-center justify-center cursor-pointer -my-2"
              onClick={() => row.logo && openViewer(getBackendFile(row.logo), `${row.name}'s Logo`)}
            >
              {row.logo ? (
                <img src={getBackendFile(row.logo)} alt={row.name} className="w-full h-full object-cover" />
              ) : (
                <Image size={20} className="text-muted-foreground" />
              )}
            </div>
            <span className="font-bold">{row.name}</span>
          </div>
        ),
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
      header={{ label: "Sponsors", count }}
      buttons={[
        {
          label: "Create Sponsor",
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
          apiUrl={endpoints.sponsor.list}
          fetchCallback={onFetch}
          columns={columns}
          actions={[
            {
              label: "View Logo",
              icon: Image,
              onClick: (row) => row.logo && openViewer(getBackendFile(row.logo), `${row.name}'s Logo`),
              disabled: (row) => !row.logo,
            },
            {
              label: "Edit",
              icon: Pencil,
              onClick: (row) => setSelectedSponsor(row.id),
              hidden: () => !canUpdate,
            },
          ]}
          initialPageSize={10}
          heightOffset={15.5}
        />
      </div>

      <SponsorModal onSuccess={() => tableRef.current?.refresh()} />
      <ImageViewer
        isOpen={viewerConfig.isOpen}
        onClose={closeViewer}
        src={viewerConfig.src}
        title={viewerConfig.title}
        alt={viewerConfig.title}
      />
    </ContentLayout>
  );
}
