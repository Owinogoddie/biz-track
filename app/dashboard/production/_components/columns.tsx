"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { Production, ProductionStatus } from '@/types/production'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'

const getStatusColor = (status: ProductionStatus) => {
  switch (status) {
    case 'PLANNED':
      return 'bg-blue-100 text-blue-800'
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    case 'ON_HOLD':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const columns: ColumnDef<Production>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as ProductionStatus
      return (
        <Badge className={getStatusColor(status)}>
          {status.replace('_', ' ')}
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
      const date = row.getValue('startDate') as Date
      return date ? new Date(date).toLocaleDateString() : '-'
    },
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('endDate') as Date
      return date ? new Date(date).toLocaleDateString() : '-'
    },
  },
  {
    accessorKey: 'actualCost',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cost" />
    ),
    cell: ({ row }) => {
      const cost = row.getValue('actualCost') as number
      return cost ? `$${cost.toFixed(2)}` : '-'
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const router = useRouter()
      
      const actions = [
        {
          label: 'View Details',
          icon: Eye,
          action: () => router.push(`/dashboard/production/${row.original.id}`)
        }
      ]

      return <DataTableRowActions row={row} actions={actions} />
    },
  },
]