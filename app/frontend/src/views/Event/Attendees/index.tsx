import ContentLayout from "@/components/common/ContentLayout";
import DataTable from "@/components/common/DataTable";
import type { ColumnConfig, DataTableHandle } from "@/core/types/component/dataTable.type";
import endpoints from "@/core/app/endpoints";
import type { AttendeesDetail } from "shared-types";
import { useCallback, useMemo, useState, useRef } from "react";
import { User, Check, X, Image, FileText, Pencil, CheckSquare } from "lucide-react";
import { useAttendeeStore } from "@/store/app/attendee.store";
import CreateAttendee from "./CreateAttendee";
import { getBackendFile } from "@/core/utils/common.utils";
import ImageViewer from "@/components/common/ImageViewer";
import { useHasPermission } from "@/core/utils/permission.utils";
import TaskToggleModal from "./TaskToggleModal";
import AllIDCardsModal from "./AllIDCardsModal";

export default function Attendees() {
  const [count, setCount] = useState(0);
  const openCreateModal = useAttendeeStore((s) => s.openCreateModal);
  const setSelectedAttendee = useAttendeeStore((s) => s.setSelectedAttendee);
  const tableRef = useRef<DataTableHandle>(null);
  const [taskModalAttendee, setTaskModalAttendee] = useState<AttendeesDetail | null>(null);

  const [viewerConfig, setViewerConfig] = useState<{ isOpen: boolean; src: string; title: string; isIdCard?: boolean }>(
    {
      isOpen: false,
      src: "",
      title: "",
      isIdCard: false,
    }
  );

  const [allCardsModalOpen, setAllCardsModalOpen] = useState(false);

  const closeViewer = () => setViewerConfig((prev) => ({ ...prev, isOpen: false }));
  const openViewer = (src: string, title: string, isIdCard = false) =>
    setViewerConfig({ isOpen: true, src, title, isIdCard });

  const columns: ColumnConfig<AttendeesDetail>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Name",
        searchable: true,
        render: (row) => (
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center cursor-pointer -my-2"
              onClick={() => row.profilePic && openViewer(getBackendFile(row.profilePic), `${row.name}'s Photo`)}
            >
              {row.profilePic ? (
                <img src={getBackendFile(row.profilePic)} alt={row.name} className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="text-muted-foreground" />
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
        key: "clubName",
        header: "Club Name",
        searchable: true,
      },
      {
        key: "position",
        header: "Position",
        searchable: true,
      },
      {
        key: "isVeg",
        header: "Is Veg",
        render: (row) => (
          <>
            {row.isVeg ? (
              <Check className="text-green-500 -my-2" size={18} strokeWidth={4} />
            ) : (
              <X className="text-red-500 -my-2" size={18} strokeWidth={4} />
            )}
          </>
        ),
      },
    ],
    []
  );

  const onFetch = useCallback((data: any) => {
    setCount(data.meta.total);
  }, []);

  const canCreate = useHasPermission("attendee.create");
  const canUpdate = useHasPermission("attendee.update");
  const canToggleTaskList = useHasPermission("attendee.task_toggle");

  return (
    <ContentLayout
      header={{ label: "Attendees", count }}
      buttons={[
        {
          label: "Get All ID Cards",
          onClick: () => setAllCardsModalOpen(true),
          className: "btn-outline-primary",
          isVisible: useHasPermission("attendee.all_id_cards"),
        },
        {
          label: "Create Attendee",
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
          apiUrl={endpoints.attendees.list}
          fetchCallback={onFetch}
          columns={columns}
          actions={[
            {
              label: "View Photo",
              icon: Image,
              onClick: (row) => row.profilePic && openViewer(getBackendFile(row.profilePic), `${row.name}'s Photo`),
              disabled: (row) => !row.profilePic,
            },
            {
              label: "View Payment Slip",
              icon: FileText,
              onClick: (row) =>
                row.paymentSlip && openViewer(getBackendFile(row.paymentSlip), `${row.name}'s Payment Slip`),
              disabled: (row) => !row.paymentSlip,
            },
            {
              label: "View ID Card",
              icon: FileText,
              onClick: (row) => row.idCard && openViewer(getBackendFile(row.idCard), `${row.name}'s ID Card`, true),
              disabled: (row) => !row.idCard,
            },
            {
              label: "Edit",
              icon: Pencil,
              onClick: (row) => setSelectedAttendee(row.id),
              hidden: () => !canUpdate,
            },
            {
              label: "Show Task List",
              icon: CheckSquare,
              onClick: (row) => setTaskModalAttendee(row),
              hidden: () => !canToggleTaskList,
            },
          ]}
          initialPageSize={10}
          heightOffset={15.5}
        />
      </div>

      <CreateAttendee onSuccess={() => tableRef.current?.refresh()} />
      <TaskToggleModal
        attendee={taskModalAttendee}
        isOpen={!!taskModalAttendee}
        onClose={() => setTaskModalAttendee(null)}
        canToggle={canToggleTaskList}
      />
      <ImageViewer
        isOpen={viewerConfig.isOpen}
        onClose={closeViewer}
        src={viewerConfig.src}
        title={viewerConfig.title}
        alt={viewerConfig.title}
        printHeight={viewerConfig.isIdCard ? "1200px" : ""}
        printWidth={viewerConfig.isIdCard ? "900px" : ""}
      />

      <AllIDCardsModal isOpen={allCardsModalOpen} onClose={() => setAllCardsModalOpen(false)} />
    </ContentLayout>
  );
}
