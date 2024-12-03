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
    cell: ({ row }) => {
      const items = row.getValue("items") as any[];
      return (
        <div className="space-y-1">
          {items.map((item, index) => (
            <div key={index} className="text-sm">
              {item.product.name} x {item.quantity}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => `KSH ${(row.getValue("total") as number).toLocaleString()}`,
  },
]