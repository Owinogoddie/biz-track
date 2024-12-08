'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { EditServiceModal } from './edit-service-modal'
import { useToast } from '@/hooks/use-toast'
import { useServiceStore } from '@/store/useServiceStore'
import { deleteService } from '@/app/actions/service'
import { Service } from '@/types/service'
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

const ServiceActions = ({ row }: { row: any }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { removeService } = useServiceStore()

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteService(row.original.id)
    
    if (result.success) {
      removeService(row.original.id)
      toast({
        title: 'Service deleted',
        description: 'Service has been deleted successfully.',
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
        <EditServiceModal
          service={row.original}
          onClose={() => setShowEditModal(false)}
        />
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service.
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

export const columns: ColumnDef<Service>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
      }).format(price)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: 'duration',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration (min)" />
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.original.category
      return <div>{category?.name || 'No category'}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ServiceActions row={row} />
  },
]