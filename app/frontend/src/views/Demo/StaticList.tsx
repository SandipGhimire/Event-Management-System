import ContentLayout from "@/components/common/ContentLayout";
import DataTable from "@/components/common/DataTable";
import type { ColumnConfig } from "@/core/types/component/dataTable.type";
import { Tag, HardDrive, Cpu } from "lucide-react";
import { useMemo } from "react";

interface ServerStatus {
  id: number;
  name: string;
  status: "Online" | "Offline" | "Maintenance";
  usage: number;
  region: string;
}

export default function StaticList() {
  const dummyData: ServerStatus[] = useMemo(
    () =>
      Array.from({ length: 45 }).map((_, i) => ({
        id: i + 1,
        name: `Node-Server-0${i + 1}`,
        status: i % 5 === 0 ? "Offline" : i % 8 === 0 ? "Maintenance" : "Online",
        usage: Math.floor(Math.random() * 100),
        region: ["US-East", "EU-West", "AP-South", "US-West"][i % 4],
      })),
    []
  );

  const columns: ColumnConfig<ServerStatus>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Server Instance",
        sortable: true,
        searchable: true,
        searchType: "text",
        render: (row) => (
          <div className="flex items-center gap-2">
            <HardDrive size={14} className="text-primary opacity-50" />
            <span className="font-bold">{row.name}</span>
          </div>
        ),
      },
      {
        key: "status",
        header: "Health Status",
        sortable: true,
        searchable: true,
        searchType: "select",
        searchOptions: [
          { label: "Online", value: "Online" },
          { label: "Offline", value: "Offline" },
          { label: "Maintenance", value: "Maintenance" },
        ],
        render: (row) => (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              row.status === "Online"
                ? "bg-success/10 text-success"
                : row.status === "Offline"
                  ? "bg-error/10 text-error"
                  : "bg-warning/10 text-warning"
            }`}
          >
            {row.status}
          </span>
        ),
      },
      {
        key: "usage",
        header: "CPU Load",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-2 w-32">
            <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${row.usage > 80 ? "bg-error" : row.usage > 50 ? "bg-warning" : "bg-success"}`}
                style={{ width: `${row.usage}%` }}
              />
            </div>
            <span className="text-[11px] font-mono">{row.usage}%</span>
          </div>
        ),
      },
      {
        key: "region",
        header: "Location",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-1 text-text-secondary">
            <Tag size={12} />
            {row.region}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <ContentLayout header="Infrastructure Monitor">
      <div className="space-y-8">
        <div className="bg-surface-alt p-4 rounded-sm border border-border flex items-center gap-4">
          <Cpu className="text-primary" />
          <div>
            <h4 className="font-bold text-sm">Cluster Performance</h4>
            <p className="text-xs text-text-secondary">Client-side rendering demo with 45 static entries</p>
          </div>
        </div>

        <DataTable
          mode="local"
          data={dummyData}
          columns={columns}
          initialPageSize={5}
          emptyMessage="No servers found in this cluster"
          heightOffset={22}
        />
      </div>
    </ContentLayout>
  );
}
