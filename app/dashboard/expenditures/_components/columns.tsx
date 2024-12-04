"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Expenditure } from "@prisma/client"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DataTableRowActions } from "@/components/ui/data-table-row-actions"
import { useToast } from "@/hooks/use-toast"
import { useExpenditureStore } from "@/store/useExpenditureStore"
import { deleteExpenditure } from "@/app/actions/expenditure"
import { ExpenditureFormModal } from "./expenditure-form-modal"
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
import { formatCurrency } from "@/lib/formatters"

interface GetColumnsProps {
  totalSales: number
  expenditures: Expenditure[]
}

export const getColumns = ({ totalSales, expenditures }: GetColumnsProps): ColumnDef<Expenditure>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      return <div>{formatCurrency(row.getValue("amount"))}</div>
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showEditModal, setShowEditModal] = useState(false)
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)
      const [isDeleting, setIsDeleting] = useState(false)
      const { toast } = useToast()
      const { removeExpenditure } = useExpenditureStore()
      
      // Calculate available balance for edit modal
      const totalExpenses = expenditures.reduce((sum, exp) => sum + exp.amount, 0)
      const availableBalance = totalSales - totalExpenses + row.original.amount // Add back current expenditure amount for edit

      const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deleteExpenditure(row.original.id)
        
        if (result.success) {
          removeExpenditure(row.original.id)
          toast({
            title: "Expenditure deleted",
            description: "Expenditure has been deleted successfully.",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error,
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
            <ExpenditureFormModal 
              expenditure={row.original}
              availableBalance={availableBalance}
            >
              <span />
            </ExpenditureFormModal>
          )}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the expenditure.
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