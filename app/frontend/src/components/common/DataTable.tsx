import { useState, useEffect, useCallback } from "react";
import type { DataTableProps } from "@/core/types/component/dataTable.type";
import { ChevronLeft, ChevronRight, FileX, Loader2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { ActionDropdown } from "./ActionDropdown";

const EMPTY_ARRAY: any[] = [];

/**
 * Custom Paginated DataTable component.
 * Supports both API-driven (server-side) and Local-set (client-side) data processing.
 */
export default function DataTable<T>({
  columns,
  mode,
  data: localData = EMPTY_ARRAY as T[],
  onFetch,
  actions,
  initialPageSize = 10,
  emptyMessage = "No data available",
  heightOffset,
}: DataTableProps<T>) {
  const instanceId = crypto.randomUUID();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const totalPages = Math.ceil(total / pageSize);

  const fetchData = useCallback(async () => {
    if (mode === "api" && onFetch) {
      setLoading(true);
      try {
        const response = await onFetch({
          page,
          pageSize,
          filters,
          sortBy,
          sortOrder,
        });
        if (response.success) {
          setData(response.data.data);
          setTotal(response.data.meta.total);
        }
      } catch (err) {
        console.error("DataTable Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    } else {
      let filtered = [...localData];

      if (Object.keys(filters).length > 0) {
        filtered = filtered.filter((row) => {
          return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            const rowValue = String((row as any)[key] ?? "").toLowerCase();
            const filterValue = String(value).toLowerCase();
            return rowValue.includes(filterValue);
          });
        });
      }

      if (sortBy) {
        filtered.sort((a: any, b: any) => {
          const valA = a[sortBy];
          const valB = b[sortBy];
          if (valA < valB) return sortOrder === "asc" ? -1 : 1;
          if (valA > valB) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });
      }

      const start = (page - 1) * pageSize;
      setTotal(filtered.length);
      setData(filtered.slice(start, start + pageSize));
    }
  }, [mode, onFetch, localData, page, pageSize, filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to first page when sort criteria change or filters change
  useEffect(() => {
    setPage(1);
  }, [filters, sortBy, sortOrder]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  return (
    <div
      className="dt-container"
      data-instance-id={instanceId}
      style={{ maxHeight: `calc(100dvh - ${heightOffset}rem)`, minHeight: `calc(100dvh - ${heightOffset}rem)` }}
    >
      {/* Table Content Area - Scrollable Y axis */}
      <div className="dt-body-wrapper">
        {loading && (
          <div className="dt-loading-overlay">
            <Loader2 className="dt-loading-icon" />
          </div>
        )}

        <table className="dt-table">
          {/* Sticky Header */}
          <thead className="dt-thead">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className={`dt-th ${col.sortable ? "dt-th-sortable" : ""}`}
                  style={{ width: col.width, textAlign: col.align || "left" }}
                >
                  <div
                    className={`dt-th-sort-wrapper ${col.align === "center" ? "center" : col.align === "right" ? "right" : ""}`}
                    onClick={() => col.sortable && handleSort(col.key as string)}
                  >
                    {col.header}
                    {col.sortable && (
                      <div className="dt-sort-icon-container">
                        {sortBy === col.key ? (
                          sortOrder === "asc" ? (
                            <ArrowUp className="dt-sort-icon-active" />
                          ) : (
                            <ArrowDown className="dt-sort-icon-active" />
                          )
                        ) : (
                          <ArrowUpDown className="dt-sort-icon-inactive" />
                        )}
                      </div>
                    )}
                  </div>
                  {col.searchable && (
                    <div className="dt-filter-wrapper" onClick={(e) => e.stopPropagation()}>
                      {col.searchType === "select" && col.searchOptions ? (
                        <select
                          className="mx-input dt-filter-input"
                          value={filters[col.key as string] || ""}
                          onChange={(e) => {
                            setFilters({ ...filters, [col.key as string]: e.target.value });
                          }}
                        >
                          <option value="">All</option>
                          {col.searchOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={col.searchType === "number" ? "number" : "text"}
                          className="mx-input dt-filter-input"
                          placeholder={`Filter...`}
                          value={filters[col.key as string] || ""}
                          onChange={(e) => {
                            setFilters({ ...filters, [col.key as string]: e.target.value });
                          }}
                        />
                      )}
                    </div>
                  )}
                </th>
              ))}
              {actions && (
                <th className="dt-th dt-td-action" style={{ width: "80px" }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="dt-tbody">
            {data.length > 0
              ? data.map((row: any, idx) => (
                  <tr key={idx} className="dt-tr-body">
                    {columns.map((col) => (
                      <td key={col.key as string} className="dt-td" style={{ textAlign: col.align || "left" }}>
                        {col.render ? col.render(row, idx) : String(row[col.key] ?? "")}
                      </td>
                    ))}
                    {actions && (
                      <td className="dt-td dt-td-action">
                        <ActionDropdown actions={actions} row={row} instanceId={instanceId} />
                      </td>
                    )}
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td colSpan={columns.length + (actions ? 1 : 0)} className="dt-empty-td">
                      <div className="dt-empty-content">
                        <div className="dt-empty-icon-wrapper">
                          <FileX className="dt-empty-icon" />
                        </div>
                        <p className="dt-empty-title">{emptyMessage}</p>
                        <p className="dt-empty-subtitle">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>

      {/* Sticky Footer / Pagination Bar */}
      <div className="dt-footer">
        <div className="dt-footer-stats">
          Showing <span className="dt-footer-stats-highlight">{Math.max(0, (page - 1) * pageSize + 1)}</span> to{" "}
          <span className="dt-footer-stats-highlight">{Math.min(page * pageSize, total)}</span> of{" "}
          <span className="dt-footer-stats-highlight">{total}</span> records
        </div>

        <div className="dt-footer-controls">
          {/* Row size selector */}
          <div className="dt-page-size-wrapper">
            <span className="dt-page-size-label">Page Size:</span>
            <select
              className="mx-input dt-page-size-select"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Controls */}
          <div className="dt-pagination-wrapper">
            <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="dt-page-btn">
              <ChevronLeft className="dt-page-btn-icon" />
            </button>
            <div className="dt-page-info">
              <span className="dt-page-current">{page}</span>
              <span className="dt-page-separator">OF</span>
              <span className="dt-page-total">{totalPages || 1}</span>
            </div>
            <button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="dt-page-btn"
            >
              <ChevronRight className="dt-page-btn-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
