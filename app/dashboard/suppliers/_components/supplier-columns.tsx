import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Supplier } from '@prisma/client'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { Badge } from "@/components/ui/badge"
import { EditSupplierModal } from './edit-supplier-modal'
import { useToast } from '@/hooks/use-toast'
import { useSupplierStore } from '@/store/useSupplierStore'
import { deleteSupplier } from '@/app/actions/supplier'
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

// Extract the actions cell into a proper React component
const SupplierActions = ({ row }: { row: any }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { removeSupplier } = useSupplierStore()

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteSupplier(row.original.id)
    
    if (result.success) {
      removeSupplier(row.original.id)
      toast({
        title: 'Supplier deleted',
        description: 'Supplier has been deleted successfully.',
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
        <EditSupplierModal
          supplier={row.original}
          onClose={() => setShowEditModal(false)}
        />
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the supplier.
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

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'ACTIVE' ? 'success' : 'destructive'}>
          {status.toLowerCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => {
      const rating = row.getValue('rating') as number
      return rating ? `${rating}/5` : 'Not rated'
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <SupplierActions row={row} />
  },
]