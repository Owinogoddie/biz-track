"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DataTableRowActions } from "@/components/ui/data-table-row-actions"
import { EditContractModal } from "./edit-contract-modal"
import { useToast } from "@/hooks/use-toast"
import { useContractStore } from "@/store/useContractStore"
import { useSupplierStore } from "@/store/useSupplierStore"
import { deleteContract } from "@/app/actions/contract"
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

export type Contract = {
  id: string
  title: string
  supplierId: string
  startDate: Date
  endDate?: Date | null
  status: "DRAFT" | "ACTIVE" | "EXPIRED" | "TERMINATED"
  terms?: string | null
  value?: number | null
  createdAt: Date
  updatedAt: Date
  businessId: string
}

// Extract Supplier Name Cell Component
const SupplierNameCell = ({ row }: { row: any }) => {
  const { suppliers } = useSupplierStore()
  const supplierId = row.getValue("supplierId") as string
  const supplier = suppliers.find(s => s.id === supplierId)
  return <>{supplier?.name || "Unknown Supplier"}</>
}

// Extract Contract Actions Component
const ContractActions = ({ row }: { row: any }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { removeContract } = useContractStore()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteContract(row.original.id)
      if (result.success) {
        removeContract(row.original.id)
        toast({
          title: "Contract deleted",
          description: "Contract has been deleted successfully.",
        })
      } else {
        throw new Error(result.error || "Failed to delete contract")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    }
    setIsDeleting(false)
    setShowDeleteDialog(false)
  }

  const actions = [
    {
      label: "Edit",
      action: () => setShowEditModal(true)
    },
    {
      label: "Delete",
      action: () => setShowDeleteDialog(true),
      variant: "destructive" as const
    }
  ]

  return (
    <>
      <DataTableRowActions row={row} actions={actions} />
      {showEditModal && (
        <EditContractModal
          contract={row.original}
          onClose={() => setShowEditModal(false)}
        />
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the contract.
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

export const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "supplierId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
    cell: ({ row }) => <SupplierNameCell row={row} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = status === "ACTIVE" ? "default" : 
                     status === "EXPIRED" ? "secondary" :
                     status === "TERMINATED" ? "destructive" : 
                     "outline"
      
      return <Badge variant={variant}>{status.toLowerCase()}</Badge>
    },
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("startDate")
      if (!(date instanceof Date) && !(typeof date === 'string')) return "-"
      return format(new Date(date), "PPP")
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("endDate")
      if (!date) return "-"
      if (!(date instanceof Date) && !(typeof date === 'string')) return "-"
      return format(new Date(date), "PPP")
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Value" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("value") as number | null
      return value ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "KSH",
      }).format(value) : "-"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ContractActions row={row} />
  },
]