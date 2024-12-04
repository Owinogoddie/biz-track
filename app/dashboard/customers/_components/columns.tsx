"use client"

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Customer } from '@prisma/client'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { CustomerDetailsModal } from './customer-details-modal'
import { useToast } from '@/hooks/use-toast'
import { useCustomerStore } from '@/store/useCustomerStore'
import { deleteCustomer } from '@/app/actions/customer'
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
import { formatCurrency } from '@/lib/formatters'

export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: 'creditLimit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Credit Limit" />
    ),
    cell: ({ row }) => formatCurrency(row.getValue('creditLimit')),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const [showDetailsModal, setShowDetailsModal] = useState(false)
      const [showEditModal, setShowEditModal] = useState(false)
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)
      const [isDeleting, setIsDeleting] = useState(false)
      const { toast } = useToast()
      const { removeCustomer } = useCustomerStore()

      const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteCustomer(row.original.id)
        
        if (result.success) {
          removeCustomer(row.original.id)
          toast({
            title: 'Customer deleted',
            description: 'Customer has been deleted successfully.',
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
          label: 'View Details',
          action: () => setShowDetailsModal(true)
        },
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
          {showDetailsModal && (
            <CustomerDetailsModal
              customer={row.original as any}
              onClose={() => setShowDetailsModal(false)}
            />
          )}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the customer.
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