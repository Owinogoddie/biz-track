import { ColumnDef } from '@tanstack/react-table'
import { FundingSource } from '@prisma/client'
import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { EditFundingSourceModal } from './edit-funding-source-modal'
import { useToast } from '@/hooks/use-toast'
import { useFundingSourceStore } from '@/store/useFundingSourceStore'
import { deleteFundingSource } from '@/app/actions/funding-source'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { useState } from 'react'
import { formatCurrency } from '@/lib/formatters'

export const columns: ColumnDef<FundingSource>[] = [
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string
      return <span className="capitalize">{type.replace('_', ' ').toLowerCase()}</span>
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'provider',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provider" />
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number
      return <span className="font-medium">{formatCurrency(amount)}</span>
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      if (!status) return null
      return <Badge variant="outline" className="capitalize">{status.toLowerCase()}</Badge>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const router = useRouter()
      const [showEditModal, setShowEditModal] = useState(false)
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)
      const [isDeleting, setIsDeleting] = useState(false)
      const { toast } = useToast()
      const { removeFundingSource } = useFundingSourceStore()

      const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteFundingSource(row.original.id)
        
        if (result.success) {
          removeFundingSource(row.original.id)
          toast({
            title: 'Funding source deleted',
            description: 'Funding source has been deleted successfully.',
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
          action: () => router.push(`/dashboard/funding/${row.original.id}`),
          icon: Eye
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
          {showEditModal && (
            <EditFundingSourceModal
              fundingSource={row.original}
              onClose={() => setShowEditModal(false)}
            />
          )}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this funding source.
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