import React from "react";
import type { PaginatedData, FetchParams, ApiResponse } from "shared-types";

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
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  className?: string; // e.g. 'text-error' for delete
  hidden?: (row: T) => boolean;
}

export interface DataTableProps<T> {
  /** Table columns configuration */
  columns: ColumnConfig<T>[];

  /** Mode of operation: 'api' for server-side, 'local' for client-side */
  mode: "api" | "local";

  /** Data for 'local' mode. For 'api' mode, use 'onFetch' instead. */
  data?: T[];

  /** Fetcher function for 'api' mode */
  onFetch?: (params: FetchParams) => Promise<ApiResponse<PaginatedData<T>>>;

  /** Optional actions for each row */
  actions?: TableAction<T>[];

  /** Initial page size, defaults to 10 */
  initialPageSize?: number;

  /** Refresh trigger - increment this to force a reload in API mode */
  refreshTrigger?: number;

  /** Empty state message */
  emptyMessage?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
}
