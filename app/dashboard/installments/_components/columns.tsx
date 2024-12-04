'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { EditInstallmentModal } from './edit-installment-modal'
import { AddPaymentModal } from './add-payment-modal'
import { useToast } from '@/hooks/use-toast'
import { useInstallmentStore } from '@/store/useInstallmentStore'
import { deleteInstallmentPlan, getInstallmentPlan } from '@/app/actions/installment'
import { Loader2 } from "lucide-react"
import { useRouter } from 'next/navigation'
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

type InstallmentPlan = {
  id: string
  totalAmount: number
  paidAmount: number
  startDate: Date
  endDate: Date | null
  status: string
  customer: { name: string }
  product: { name: string }
}

export const columns: ColumnDef<InstallmentPlan>[] = [
  {
    accessorKey: 'customer.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
  },
  {
    accessorKey: 'product.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
  },
  {
    accessorKey: 'totalAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'))
      const formatted = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
      }).format(amount)
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: 'progress',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Progress" />
    ),
    cell: ({ row }) => {
      const total = row.original.totalAmount
      const paid = row.original.paidAmount
      const progress = (paid / total) * 100
      
      return (
        <div className="w-full">
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground mt-1">
            KES {paid.toLocaleString()} of KES {total.toLocaleString()} ({progress.toFixed(1)}%)
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'COMPLETED' ? 'secondary' : 'default'}>
          {status.toLowerCase()}
        </Badge>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const router = useRouter()
      const [showEditModal, setShowEditModal] = useState(false)
      const [showPaymentModal, setShowPaymentModal] = useState(false)
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)
      const [isDeleting, setIsDeleting] = useState(false)
      const { toast } = useToast()
      const { removeInstallmentPlan, updateInstallmentPlan } = useInstallmentStore()

      const refreshPlanData = async () => {
        const result = await getInstallmentPlan(row.original.id)
        if (result.success) {
          updateInstallmentPlan(result.plan)
        }
      }

      const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteInstallmentPlan(row.original.id)
        
        if (result.success) {
          removeInstallmentPlan(row.original.id)
          toast({
            title: 'Plan deleted',
            description: 'Installment plan has been deleted successfully.',
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
          action: () => router.push(`/dashboard/installments/${row.original.id}`),
        },
        {
          label: 'Edit Plan',
          action: () => setShowEditModal(true)
        },
        {
          label: 'Add Payment',
          action: () => setShowPaymentModal(true)
        },
        {
          label: 'Delete Plan',
          action: () => setShowDeleteDialog(true),
          variant: 'destructive' as const
        }
      ]

      return (
        <>
          <DataTableRowActions row={row} actions={actions} />
          
          {showEditModal && (
            <EditInstallmentModal
              installmentPlan={row.original}
              onClose={() => setShowEditModal(false)}
              onSuccess={() => {
                refreshPlanData()
                setShowEditModal(false)
              }}
            />
          )}
          
          {showPaymentModal && (
            <AddPaymentModal
              installmentPlanId={row.original.id}
              onClose={() => setShowPaymentModal(false)}
              onSuccess={() => {
                refreshPlanData()
                setShowPaymentModal(false)
              }}
            />
          )}

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the installment plan.
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