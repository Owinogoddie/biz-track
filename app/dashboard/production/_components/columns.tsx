'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { EditProductionModal } from './edit-production-modal'
import { useToast } from '@/hooks/use-toast'
import { useProductionStore } from '@/store/useProductionStore'
import { deleteProduction } from '@/app/actions/production'
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
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

// Extract BatchNumber cell into a proper React component
const BatchNumberCell = ({ row }: { row: any }) => {
  const router = useRouter()
  return (
    <div
      onClick={() => router.push(`/dashboard/${row.original.id}`)}
      className="cursor-pointer hover:underline text-primary"
    >
      {row.getValue('batchNumber')}
    </div>
  )
}

// Extract the actions cell into a proper React component
const ProductionActions = ({ row }: { row: any }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { removeProduction } = useProductionStore()
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteProduction(row.original.id)
    
    if (result.success) {
      removeProduction(row.original.id)
      toast({
        title: 'Production deleted',
        description: 'Production record has been deleted successfully.',
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
      action: () => router.push(`/dashboard/production/${row.original.id}`)
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
        <EditProductionModal
          production={row.original}
          onClose={() => setShowEditModal(false)}
        />
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the production record and all associated data.
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

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'batchNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Batch Number" />
    ),
    cell: ({ row }) => <BatchNumberCell row={row} />
  },
  {
    accessorKey: 'productName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
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
        <Badge variant={
          status === 'COMPLETED' ? 'success' :
          status === 'IN_PROGRESS' ? 'warning' :
          'secondary'
        }>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('startDate'))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: 'stages',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stages" />
    ),
    cell: ({ row }) => {
      const stages = row.getValue('stages') as any[]
      return <div>{stages.length} stages</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ProductionActions row={row} />
  },
]