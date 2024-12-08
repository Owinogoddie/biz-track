import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DistributionClient, ClientType } from '@prisma/client'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { DataTableRowActions } from '@/components/ui/data-table-row-actions'
import { EditClientModal } from './edit-client-modal'
import { useToast } from '@/hooks/use-toast'
import { useDistributionClientStore } from '@/store/useDistributionClientStore'
import { deleteDistributionClient } from '@/app/actions/distributionClient'
import { Badge } from '@/components/ui/badge'
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

const ClientTypeCell = ({ type }: { type: ClientType }) => {
  const typeColors = {
    SCHOOL: "bg-blue-100 text-blue-800",
    HOTEL: "bg-purple-100 text-purple-800",
    RESTAURANT: "bg-green-100 text-green-800",
    RETAIL_STORE: "bg-yellow-100 text-yellow-800",
    OTHER: "bg-gray-100 text-gray-800",
  }

  return (
    <Badge className={typeColors[type]}>
      {type.replace('_', ' ')}
    </Badge>
  )
}

const ClientActions = ({ row }: { row: any }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { removeClient } = useDistributionClientStore()

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteDistributionClient(row.original.id)
    
    if (result.success) {
      removeClient(row.original.id)
      toast({
        title: 'Client deleted',
        description: 'Client has been deleted successfully.',
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
        <EditClientModal
          client={row.original}
          onClose={() => setShowEditModal(false)}
        />
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the client.
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

export const columns: ColumnDef<DistributionClient>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <ClientTypeCell type={row.getValue('type')} />,
  },
  {
    accessorKey: 'contactPerson',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Person" />
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <ClientActions row={row} />
  },
]