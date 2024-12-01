"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Sale } from "@/types/sale"

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "PPp"),
  },
  {
    accessorKey: "seller.name",
    header: "Seller",
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => (row.getValue("items") as any[]).length,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `$${(row.getValue("total") as number).toFixed(2)}`,
  },
]