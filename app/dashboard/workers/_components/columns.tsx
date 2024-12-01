"use client"

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Worker, PaymentPeriod } from '@prisma/client'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { EditWorkerModal } from './edit-worker-modal'
import { useToast } from '@/hooks/use-toast'
import { useWorkerStore } from '@/store/useWorkerStore'
import { deleteWorker } from '@/app/actions/worker'
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

export const columns: ColumnDef<Worker>[] = [
  {
    id: 'name',
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
  },
  {
    id: 'paymentPeriod',
    accessorKey: 'paymentPeriod',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Period" />
    ),
    cell: ({ row }) => {
      const period = row.getValue('paymentPeriod') as PaymentPeriod
      return (
        <Badge variant="secondary">
          {period.toLowerCase()}
        </Badge>
      )
    },
  },
  {
    id: 'rate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rate" />
    ),
    cell: ({ row }) => {
      const worker = row.original
      const rate = worker.paymentPeriod === PaymentPeriod.HOURLY ? worker.hourlyRate :
                  worker.paymentPeriod === PaymentPeriod.DAILY ? worker.dailyRate :
                  worker.monthlyRate
      
      return rate ? `$${rate}/${worker.paymentPeriod.toLowerCase().slice(0, -2)}` : '-'
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const [showEditModal, setShowEditModal] = useState(false)
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)
      const [isDeleting, setIsDeleting] = useState(false)
      const { toast } = useToast()
      const { removeWorker } = useWorkerStore()

      const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteWorker(row.original.id)
        
        if (result.success) {
          removeWorker(row.original.id)
          toast({
            title: 'Worker deleted',
            description: 'Worker has been deleted successfully.',
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
            <EditWorkerModal
              worker={row.original}
              onClose={() => setShowEditModal(false)}
            />
          )}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the worker record.
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