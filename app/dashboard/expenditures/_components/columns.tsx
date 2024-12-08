"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DataTableRowActions } from "@/components/ui/data-table-row-actions"
import { useToast } from "@/hooks/use-toast"
import { useExpenditureStore } from "@/store/useExpenditureStore"
import { deleteExpenditure } from "@/app/actions/expenditure"
import { ExpenditureWithFundingSource } from "@/types/expenditure"
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
import { ExpenditureFormModal } from "./expenditure-form-modal"

const sourceLabels: Record<string, string> = {
  BUSINESS_OPERATIONS: "Business Operations",
  LOAN: "Loans",
  GIFT: "Gifts",
  INVESTMENT: "Investments",
  PERSONAL_FUNDS: "Personal Funds",
  OTHER: "Other Sources"
}

interface GetColumnsProps {
  totalSales: number
  expenditures: ExpenditureWithFundingSource[]
}

// Extract ExpenditureActions Component
const ExpenditureActions = ({ 
  row, 
  totalSales, 
  expenditures 
}: { 
  row: any, 
  totalSales: number, 
  expenditures: ExpenditureWithFundingSource[] 
}) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const { removeExpenditure } = useExpenditureStore()
  
  const totalExpenses = expenditures.reduce((sum, exp) => sum + exp.amount, 0)
  const availableBalance = totalSales - totalExpenses + row.original.amount

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
          sales={totalSales}
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
}

export const getColumns = ({ totalSales, expenditures }: GetColumnsProps): ColumnDef<ExpenditureWithFundingSource>[] => [
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
    accessorKey: "fundingSource",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Funding Source" />
    ),
    cell: ({ row }) => {
      const fundingSource = row.original.fundingSource
      return fundingSource ? (
        <Badge variant="secondary">
          {fundingSource.name}
        </Badge>
      ) : (
        <Badge variant="outline">Sales Revenue</Badge>
      )
    },
  },
  {
    accessorKey: "source",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
    cell: ({ row }) => {
      return <div>{sourceLabels[row.getValue("source") as string]}</div>
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
    cell: ({ row }) => (
      <ExpenditureActions 
        row={row} 
        totalSales={totalSales} 
        expenditures={expenditures} 
      />
    ),
  },
]