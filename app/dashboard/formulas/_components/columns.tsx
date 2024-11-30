'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ProductionFormula } from '@prisma/client'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { EditFormulaModal } from './edit-formula-modal'
import { useToast } from '@/hooks/use-toast'
import { useFormulaStore } from '@/store/useFormulaStore'
import { deleteFormula } from '@/app/actions/formula'
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

export const columns: ColumnDef<ProductionFormula>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: 'product.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const [showEditModal, setShowEditModal] = useState(false)
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)
      const [isDeleting, setIsDeleting] = useState(false)
      const { toast } = useToast()
      const { removeFormula } = useFormulaStore()

      const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteFormula(row.original.id)
        
        if (result.success) {
          removeFormula(row.original.id)
          toast({
            title: 'Formula deleted',
            description: 'Formula has been deleted successfully.',
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
            <EditFormulaModal
              formula={row.original}
              onClose={() => setShowEditModal(false)}
            />
          )}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the formula.
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
    },
  },
]