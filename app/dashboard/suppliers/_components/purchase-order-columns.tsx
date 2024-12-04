import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { PurchaseOrder } from '@prisma/client'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { Badge } from "@/components/ui/badge"
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

export const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: 'poNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PO Number" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const variant = status === 'COMPLETED' ? 'default' : 
                     status === 'APPROVED' ? 'default' :
                     status === 'REJECTED' ? 'destructive' : 'secondary'
      
      return (
        <Badge variant={variant}>
          {status.toLowerCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'issueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issue Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('issueDate') as string
      return format(new Date(date), 'PP')
    },
  },
  {
    accessorKey: 'deliveryDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delivery Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('deliveryDate') as string
      return date ? format(new Date(date), 'PP') : '-'
    },
  },
  {
    accessorKey: 'totalAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
      return formatted
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { toast } = useToast()
      
      const handleViewDetails = () => {
        toast({
          title: 'View Details',
          description: 'This feature is coming soon!',
        })
      }

      const actions = [
        {
          label: 'View Details',
          action: handleViewDetails
        }
      ]

      return <DataTableRowActions row={row} actions={actions} />
    },
  },
]