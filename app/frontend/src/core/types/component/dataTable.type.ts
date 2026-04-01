import React from "react";
import type { LucideIcon } from "lucide-react";
import type { PaginatedData, ApiResponse } from "shared-types";

export interface ColumnConfig<T> {
  key: keyof T | string;
  header: React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  searchType?: "text" | "number" | "select";
  searchOptions?: { label: string; value: string | number }[];
}

export interface TableAction<T> {
  label: string;
  icon?: LucideIcon;
  onClick: (row: T) => void;
  className?: string; // e.g. 'text-error' for delete
  hidden?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}

export interface DataTableProps<T> {
  /** Table columns configuration */
  columns: ColumnConfig<T>[];

  /** Mode of operation: 'api' for server-side, 'local' for client-side */
  mode: "api" | "local";

  /** API URL for 'api' mode */
  apiUrl?: string;

  /** Data for 'local' mode. For 'api' mode, use 'onFetch' instead. */
  data?: T[];

  /** Fetcher function for 'api' mode */
  fetchCallback?: (params: ApiResponse<PaginatedData<T>>) => void;

  /** Optional actions for each row */
  actions?: TableAction<T>[];

  /** Initial page size, defaults to 10 */
  initialPageSize?: number;

  /** Refresh trigger - increment this to force a reload in API mode */
  refreshTrigger?: number;

  /** Empty state message */
  emptyMessage?: string;

  /** Height offset for the table */
  heightOffset?: number;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface DataTableHandle {
  refresh: () => void;
}
