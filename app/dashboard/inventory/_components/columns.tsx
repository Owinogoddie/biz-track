"use client"

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { InventoryAsset, MaintenanceStatus } from '@prisma/client'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useInventoryStore } from '@/store/useInventoryStore'
import { MaintenanceLogModal } from './maintenance-log-modal'
import { EditAssetModal } from './edit-asset-modal'
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
import { deleteAsset } from '@/app/actions/inventory'

const getStatusColor = (status: MaintenanceStatus) => {
  switch (status) {
    case 'GOOD':
      return 'bg-green-500'
    case 'NEEDS_ATTENTION':
      return 'bg-yellow-500'
    case 'UNDER_MAINTENANCE':
      return 'bg-blue-500'
    case 'CRITICAL':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

// Extracted Actions Component
const InventoryAssetActions = ({ row }: { row: any }) => {
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { removeAsset } = useInventoryStore()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteAsset(row.original.id)
      
      if (result.success) {
        removeAsset(row.original.id)
        
        toast({
          title: 'Asset Deleted',
          description: 'The asset has been successfully removed.',
          variant: 'default'
        })
      } else {
        toast({
          title: 'Deletion Failed',
          description: result.error || 'Unable to delete the asset',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const actions = [
    {
      label: 'Edit',
      action: () => setShowEditModal(true)
    },
    {
      label: 'Log Maintenance',
      action: () => setShowMaintenanceModal(true)
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
      {showMaintenanceModal && (
        <MaintenanceLogModal
          asset={row.original}
          onClose={() => setShowMaintenanceModal(false)}
        />
      )}
      {showEditModal && (
        <EditAssetModal
          asset={row.original}
          onClose={() => setShowEditModal(false)}
        />
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the asset.
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

export const columns: ColumnDef<InventoryAsset>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'assetType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue('assetType') as string
      return type.charAt(0) + type.slice(1).toLowerCase()
    },
  },
  {
    accessorKey: 'condition',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Condition" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('condition') as MaintenanceStatus
      return (
        <Badge className={getStatusColor(status)}>
          {status.replace('_', ' ')}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'lastMaintenance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Maintenance" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('lastMaintenance')
      return date ? new Date(date as string).toLocaleDateString() : 'Never'
    },
  },
  {
    accessorKey: 'nextMaintenance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Next Maintenance" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('nextMaintenance')
      return date ? new Date(date as string).toLocaleDateString() : 'Not scheduled'
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <InventoryAssetActions row={row} />
  },
]