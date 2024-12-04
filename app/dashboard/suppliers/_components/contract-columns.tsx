import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { SupplierContract } from '@prisma/client'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { Badge } from "@/components/ui/badge"
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

export const columns: ColumnDef<SupplierContract>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const variant = status === 'ACTIVE' ? 'default' : 
                     status === 'EXPIRED' ? 'secondary' :
                     status === 'TERMINATED' ? 'destructive' : 'secondary'
      
      return (
        <Badge variant={variant}>
          {status.toLowerCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('startDate') as string
      return format(new Date(date), 'PP')
    },
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('endDate') as string
      return date ? format(new Date(date), 'PP') : 'No end date'
    },
  },
  {
    accessorKey: 'value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Value" />
    ),
    cell: ({ row }) => {
      const value = row.getValue('value') as number
      return value ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value) : '-'
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