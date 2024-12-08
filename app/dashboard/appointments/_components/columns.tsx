'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useAppointmentStore } from '@/store/useAppointmentStore'
import { deleteAppointment, updateAppointmentStatus } from '@/app/actions/appointment'
import { Appointment, AppointmentStatus } from '@/types/service'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
type AppointmentWithDetails = {
    id: string
    serviceId: string
    customerId: string
    businessId: string
    startTime: Date
    endTime: Date
    status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
    notes: string | null
    service: {
      id: string
      name: string
    }
    customer: {
      id: string
      name: string
    }
  }
const getStatusColor = (status: AppointmentStatus) => {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-blue-500'
    case 'CONFIRMED':
      return 'bg-green-500'
    case 'COMPLETED':
      return 'bg-gray-500'
    case 'CANCELLED':
      return 'bg-red-500'
    case 'NO_SHOW':
      return 'bg-yellow-500'
  }
}

const AppointmentActions = ({ row }: { row: any }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { removeAppointment, updateAppointment } = useAppointmentStore()

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteAppointment(row.original.id)
    
    if (result.success) {
      removeAppointment(row.original.id)
      toast({
        title: 'Appointment deleted',
        description: 'Appointment has been deleted successfully.',
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      })
    }
    setIsDeleting(false)
    setShowDeleteDialog(false)
  }

  const handleStatusChange = async (status: AppointmentStatus) => {
    const result = await updateAppointmentStatus(row.original.id, status)
    if (result.success) {
      updateAppointment(result.appointment)
      toast({
        title: 'Status updated',
        description: `Appointment status updated to ${status}`,
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      })
    }
  }

  const actions = [
    {
      label: 'Confirm',
      action: () => handleStatusChange('CONFIRMED'),
      disabled: row.original.status !== 'SCHEDULED'
    },
    {
      label: 'Complete',
      action: () => handleStatusChange('COMPLETED'),
      disabled: row.original.status !== 'CONFIRMED'
    },
    {
      label: 'Cancel',
      action: () => handleStatusChange('CANCELLED'),
      disabled: ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(row.original.status)
    },
    {
      label: 'Mark as No-Show',
      action: () => handleStatusChange('NO_SHOW'),
      disabled: ['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(row.original.status)
    },
    {
      label: 'Delete',
      action: () => setShowDeleteDialog(true),
      variant: 'destructive' as const
    }
  ]

  return (
    <>
      <DataTableRowActions row={row} actions={actions} />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the appointment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const columns: ColumnDef<AppointmentWithDetails>[] = [
  {
    accessorKey: 'customer.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
  },
  {
    accessorKey: 'service.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Service" />
    ),
  },
  {
    accessorKey: 'startTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date & Time" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('startTime'))
      return format(date, 'PPp')
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as AppointmentStatus
      return (
        <Badge className={`${getStatusColor(status)} text-white`}>
          {status}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <AppointmentActions row={row} />
  },
]