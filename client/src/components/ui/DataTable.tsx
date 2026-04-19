import { useState, useMemo, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download, Columns3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Skeleton } from './Skeleton';
import { cn } from '../../lib/utils';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  loading?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSizeChange?: (size: number) => void;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (rows: T[]) => void;
  enableColumnVisibility?: boolean;
  enableExport?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

// ─── CSV Export Helper ────────────────────────────────────────────────────────

function exportToCSV<T>(data: T[], columns: ColumnDef<T, unknown>[], filename: string) {
  const visibleCols = columns.filter(
    (col) => 'accessorKey' in col || 'accessorFn' in col
  );
  const headers = visibleCols.map((col) => {
    if (typeof col.header === 'string') return col.header;
    if ('accessorKey' in col) return String(col.accessorKey);
    return 'Column';
  });

  const rows = data.map((row) =>
    visibleCols.map((col) => {
      if ('accessorKey' in col) {
        const key = col.accessorKey as string;
        const val = (row as Record<string, unknown>)[key];
        return val !== null && val !== undefined ? String(val) : '';
      }
      return '';
    })
  );

  const csv = [
    headers.join(','),
    ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTable<T>({
  columns,
  data,
  loading = false,
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  page = 0,
  size = 10,
  totalElements = 0,
  totalPages = 1,
  onPageChange,
  onSizeChange,
  enableRowSelection = false,
  onRowSelectionChange,
  enableColumnVisibility = true,
  enableExport = true,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your search or filters.',
  className,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const allColumns = useMemo(() => {
    if (!enableRowSelection) return columns;
    const selectCol: ColumnDef<T, unknown> = {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          className="rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary/50"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary/50"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
      size: 40,
    };
    return [selectCol, ...columns];
  }, [columns, enableRowSelection]);

  const table = useReactTable({
    data,
    columns: allColumns,
    state: { sorting, rowSelection, columnVisibility },
    onSortingChange: setSorting,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(next);
      if (onRowSelectionChange) {
        const selectedRows = Object.keys(next)
          .filter((k) => next[k])
          .map((k) => data[parseInt(k)])
          .filter(Boolean);
        onRowSelectionChange(selectedRows);
      }
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection,
    manualPagination: true,
    pageCount: totalPages,
  });

  const startRow = page * size + 1;
  const endRow = Math.min((page + 1) * size, totalElements);

  const handleExport = useCallback(() => {
    exportToCSV(data, columns, 'export');
  }, [data, columns]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {onSearchChange && (
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder={searchPlaceholder}
              value={searchValue ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          {enableColumnVisibility && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="outline" size="sm" leftIcon={<Columns3 className="h-4 w-4" />}>
                  Columns
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[180px] rounded-lg border border-slate-700 bg-slate-800 p-2 shadow-xl"
                  sideOffset={5}
                  align="end"
                >
                  {table.getAllLeafColumns().filter(c => c.id !== 'select').map((column) => (
                    <DropdownMenu.CheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(val) => column.toggleVisibility(!!val)}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-200 outline-none hover:bg-slate-700/50"
                    >
                      <DropdownMenu.ItemIndicator>
                        <span className="h-4 w-4 text-primary">✓</span>
                      </DropdownMenu.ItemIndicator>
                      <span className="capitalize">{column.id}</span>
                    </DropdownMenu.CheckboxItem>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
          {enableExport && data.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-slate-700/50 bg-slate-800/80">
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDir = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400',
                          canSort && 'cursor-pointer select-none hover:text-slate-200'
                        )}
                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      >
                        <div className="flex items-center gap-1.5">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className="text-slate-500">
                              {sortDir === 'asc' ? (
                                <ArrowUp className="h-3.5 w-3.5" />
                              ) : sortDir === 'desc' ? (
                                <ArrowDown className="h-3.5 w-3.5" />
                              ) : (
                                <ArrowUpDown className="h-3.5 w-3.5" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-${i}`} className="border-b border-slate-700/30">
                    {allColumns.map((_, j) => (
                      <td key={`skel-${i}-${j}`} className="px-4 py-3">
                        <Skeleton.Line height="14px" width={j === 0 ? '70%' : `${50 + Math.random() * 40}%`} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={allColumns.length} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="h-16 w-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-slate-300">{emptyTitle}</p>
                        <p className="mt-1 text-xs text-slate-500">{emptyDescription}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      'border-b border-slate-700/30 transition-colors hover:bg-slate-800/50',
                      row.getIsSelected() && 'bg-primary/5'
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-slate-200">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalElements > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Showing {startRow} to {endRow} of {totalElements} results
          </p>
          <div className="flex items-center gap-2">
            <select
              value={size}
              onChange={(e) => onSizeChange?.(Number(e.target.value))}
              className="h-8 rounded-md border border-slate-700 bg-slate-800 px-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {[10, 20, 30, 50].map((s) => (
                <option key={s} value={s}>
                  {s} / page
                </option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => onPageChange?.(page - 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (page < 3) {
                  pageNum = i;
                } else if (page > totalPages - 4) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => onPageChange?.(pageNum)}
                    className="h-8 w-8 p-0"
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => onPageChange?.(page + 1)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
