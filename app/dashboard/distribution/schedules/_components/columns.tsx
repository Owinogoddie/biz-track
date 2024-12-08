import { ColumnDef } from '@tanstack/react-table'
import { DeliveryRoute, DeliverySchedule, DistributionClient, Frequency } from '@prisma/client'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useDeliveryScheduleStore } from '@/store/useDeliveryScheduleStore'
import { deleteDeliverySchedule } from '@/app/actions/deliverySchedule'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { EditScheduleModal } from './edit-schedule-modal'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"

const FrequencyCell = ({ frequency }: { frequency: Frequency }) => {
  const frequencyColors = {
    DAILY: "bg-blue-100 text-blue-800",
    WEEKLY: "bg-green-100 text-green-800",
    BIWEEKLY: "bg-purple-100 text-purple-800",
    MONTHLY: "bg-yellow-100 text-yellow-800",
    CUSTOM: "bg-gray-100 text-gray-800",
  }

  return (
    <Badge className={frequencyColors[frequency]}>
      {frequency.replace('_', ' ')}
    </Badge>
  )
}

const ScheduleActions = ({ 
  row, 
  clients, 
  routes 
}: { 
  row: any, 
  clients: DistributionClient[], 
  routes: DeliveryRoute[] 
}) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { removeSchedule } = useDeliveryScheduleStore()

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteDeliverySchedule(row.original.id)
    
    if (result.success) {
      removeSchedule(row.original.id)
      toast({
        title: 'Schedule deleted',
        description: 'Schedule has been deleted successfully.',
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

  const actions = [
    {
      label: 'Edit',
      action: () => setShowEditModal(true)
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
      {showEditModal && (
        <EditScheduleModal
          schedule={row.original}
          clients={clients}
          routes={routes}
          onClose={() => setShowEditModal(false)}
        />
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the schedule.
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

export const columns = ({ 
  clients, 
  routes 
}: { 
  clients: DistributionClient[], 
  routes: DeliveryRoute[] 
}): ColumnDef<DeliverySchedule>[] => [
  {
    accessorKey: 'client.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
  },
  {
    accessorKey: 'route.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Route" />
    ),
  },
  {
    accessorKey: 'frequency',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Frequency" />
    ),
    cell: ({ row }) => <FrequencyCell frequency={row.getValue('frequency')} />,
  },
  {
    accessorKey: 'dayOfWeek',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Day of Week" />
    ),
    cell: ({ row }) => {
      const dayOfWeek = row.getValue('dayOfWeek')
      if (typeof dayOfWeek !== 'number' || dayOfWeek < 0 || dayOfWeek > 6) return null
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return days[dayOfWeek]
    }
  },
  {
    accessorKey: 'dayOfMonth',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Day of Month" />
    ),
  },
  {
    accessorKey: 'timeWindow',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time Window" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <ScheduleActions 
        row={row} 
        clients={clients} 
        routes={routes} 
      />
    )
  },
]