"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLayoutColumns,
  IconLoader,
  IconChevronUp,
  IconCircleXFilled,
} from "@tabler/icons-react";

import { z } from "zod";
import { format, parseISO } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { api } from "@/lib/utils";

export const schema = z.object({
  id: z.string(),
  merchant_id: z.string(),
  currency: z.string(),
  amount: z.number(),
  amount_usd: z.number(),
  tx_hash: z.string().nullable(),
  address: z.string(),
  status: z.string(),
  network: z.string(),
  mode: z.string(),
  confirmed_at: z.string().nullable(),
  created_at: z.string(),
  expires_at: z.string(),
  origin: z.string().optional(),
  payment_link_id: z.string().optional(),
  sender_address: z.string().optional(),
  sender_email: z.string().optional(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.original.address?.slice(0, 8)}...
          {row.original.address?.slice(-6)}
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      // Format cryptocurrency amounts based on currency
      let formattedAmount = row.original.amount;

      // Different formatting based on cryptocurrency type
      if (row.original.currency === "SOL" || row.original.currency === "ETH") {
        // For SOL/ETH, show 4 decimal places
        formattedAmount = parseFloat(row.original.amount.toFixed(4));
      } else if (row.original.currency === "BTC") {
        // For BTC, show 6 decimal places
        formattedAmount = parseFloat(row.original.amount.toFixed(6));
      } else {
        // For other currencies, show 2 decimal places
        formattedAmount = parseFloat(row.original.amount.toFixed(2));
      }

      return <div>{formattedAmount}</div>;
    },
  },
  {
    accessorKey: "amount_usd",
    header: "Amount (USD)",
    cell: ({ row }) => (
      <div className="w-32">${row.original.amount_usd.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Status
          {column.getIsSorted() === "asc" ? (
            <IconChevronUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <IconChevronDown className="h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      let color = "bg-gray-100 text-gray-800";
      let icon = <IconLoader className="mr-1 h-4 w-4" />;

      if (status === "COMPLETED") {
        color = "bg-green-100 text-green-800";
        icon = (
          <IconCircleCheckFilled className="mr-1 h-4 w-4 fill-green-500" />
        );
      } else if (status === "PENDING") {
        color = "bg-orange-100 text-orange-800";
        icon = <IconLoader className="mr-1 h-4 w-4 text-orange-500" />;
      } else if (status === "EXPIRED") {
        color = "bg-red-100 text-red-800";
        icon = <IconCircleXFilled className="mr-1 h-4 w-4 fill-red-500" />;
      }

      return (
        <Badge
          variant="outline"
          className={`flex items-center px-2 py-1 ${color}`}
        >
          {icon}
          {status}
        </Badge>
      );
    },
    sortingFn: (rowA, rowB) => {
      // Custom sorting function for status
      const statusOrder: Record<string, number> = {
        COMPLETED: 2,
        PENDING: 1,
      };

      const aValue = statusOrder[rowA.original.status] || 0;
      const bValue = statusOrder[rowB.original.status] || 0;

      return bValue - aValue; // Descending order by default
    },
  },
  {
    accessorKey: "network",
    header: "Network",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.network}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1"
        >
          Created At
          {column.getIsSorted() === "asc" ? (
            <IconChevronUp className="h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <IconChevronDown className="h-4 w-4" />
          ) : null}
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{format(parseISO(row.original.created_at), "PPp")}</div>;
    },
  },
  {
    accessorKey: "mode",
    header: "Mode",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.mode}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const status = row.original.status;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(row.original.address)
              }
            >
              Copy Address
            </DropdownMenuItem>
            {row.original.tx_hash && row.original.tx_hash !== "null" && (
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(row.original.tx_hash || "")
                }
              >
                Copy TX Hash
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                table.setColumnFilters([{ id: "status", value: status }]);
              }}
            >
              Filter by "{status}" status
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                table.setColumnFilters([]);
              }}
            >
              Clear filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "status", desc: true }, // Default sorting by status
  ]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Function to sort transactions by status
  const sortTransactionsByStatus = (transactions: z.infer<typeof schema>[]) => {
    return [...transactions].sort((a, b) => {
      // Priority order: COMPLETED > PENDING > others
      const statusOrder: Record<string, number> = {
        COMPLETED: 2,
        PENDING: 1,
        EXPIRED: 0,
      };

      const aValue = statusOrder[a.status] || 0;
      const bValue = statusOrder[b.status] || 0;

      return bValue - aValue; // Descending order
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<{
          transactions: z.infer<typeof schema>[];
        }>("/metrics/transactions", {
          showErrorToast: false,
        });
        if (response.status === 200 && response.data) {
          // Sort transactions by status when data is loaded
          const sortedTransactions = sortTransactionsByStatus(
            response.data.transactions
          );
          setData(sortedTransactions);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="text-xl font-semibold">Transactions</div>
        <div className="flex items-center gap-2">
          <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string) || "all"
            }
            onValueChange={(value) => {
              table
                .getColumn("status")
                ?.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={
              (table.getColumn("mode")?.getFilterValue() as string) || "all"
            }
            onValueChange={(value) => {
              table
                .getColumn("mode")
                ?.setFilterValue(value === "all" ? undefined : value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="TESTNET">Testnet</SelectItem>
              <SelectItem value="MAINNET">Mainnet</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns className="mr-2 h-4 w-4" />
                Filters
                <IconChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuCheckboxItem
                checked={sorting.some((s) => s.id === "status" && s.desc)}
                onCheckedChange={(value) => {
                  if (value) {
                    setSorting([{ id: "status", desc: true }]);
                    setData(sortTransactionsByStatus(data));
                  } else {
                    setSorting([]);
                  }
                }}
              >
                Show Completed First
              </DropdownMenuCheckboxItem>
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      Show {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}
