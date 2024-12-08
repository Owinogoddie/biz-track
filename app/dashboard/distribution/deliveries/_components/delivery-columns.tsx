'use client'
import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DeliveryTransaction, TransactionStatus } from '@prisma/client'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { EditDeliveryModal } from './edit-delivery-modal'
import { useToast } from '@/hooks/use-toast'
import { useDeliveryStore } from '@/store/useDeliveryStore'
import { deleteDeliveryTransaction } from '@/app/actions/delivery'
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
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

const DeliveryActions = ({ row }: { row: any }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { removeDelivery } = useDeliveryStore()

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteDeliveryTransaction(row.original.id)
    
    if (result.success) {
      removeDelivery(row.original.id)
      toast({
        title: 'Delivery record deleted',
        description: 'Delivery record has been deleted successfully.',
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
        <EditDeliveryModal
          delivery={row.original}
          onClose={() => setShowEditModal(false)}
        />
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the delivery record.
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

const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case 'PENDING':
      return 'default'
    case 'COMPLETED':
      return 'success'
    case 'PARTIAL':
      return 'warning'
    case 'CANCELLED':
      return 'destructive'
    default:
      return 'default'
  }
}

export const columns: ColumnDef<DeliveryTransaction>[] = [
  {
    accessorKey: 'order.client.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
  },
  {
    accessorKey: 'deliveryDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delivery Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('deliveryDate'))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as TransactionStatus
      return (
        <Badge variant={getStatusColor(status)}>
          {status.replace('_', ' ')}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'deliveredItems',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items Delivered" />
    ),
    cell: ({ row }) => {
      const items = row.original.deliveredItems
      return <div>{items.length} items</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DeliveryActions row={row} />
  },
]