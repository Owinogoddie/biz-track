"use client"
"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontal, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updatePurchaseOrderStatus, deletePurchaseOrder } from "@/app/actions/purchaseOrder"
import { usePurchaseOrderStore } from "@/store/usePurchaseOrderStore"
import { useToast } from "@/hooks/use-toast"
import { EditPOModal } from "./edit-purchase-order-modal"
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

type POStatus = "DRAFT" | "SENT" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED"
export type PurchaseOrder = {
    id: string
    poNumber: string
    status: POStatus
    issueDate: Date
    deliveryDate: Date | null
    totalAmount: number
    notes: string | null
    supplierId: string
    supplier: {
      name: string
    }
    businessId: string
    createdAt: Date
    updatedAt: Date
    items: {
      id: string
      description: string
      quantity: number
      unitPrice: number
      totalPrice: number
    }[]
  }
  

export const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "poNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="PO Number" />
    ),
  },
  {
    accessorKey: "supplier.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supplier" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as POStatus
      const variant = 
        status === "COMPLETED" ? "default" :
        status === "APPROVED" ? "default" :
        status === "REJECTED" ? "destructive" : 
        "secondary"

      return <Badge variant={variant}>{status.toLowerCase()}</Badge>
    },
  },
  {
    accessorKey: "issueDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Issue Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("issueDate")
      if (!(date instanceof Date) && !(typeof date === 'string')) return "-"
      return format(new Date(date), "PPP")
    },
  },
  {
    accessorKey: "deliveryDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Delivery Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("deliveryDate")
      if (!date) return "-"
      if (!(date instanceof Date) && !(typeof date === 'string')) return "-"
      return format(new Date(date), "PP")
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "KSH",
      }).format(amount)
      return formatted
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [showEditModal, setShowEditModal] = useState(false)
      const [showDeleteDialog, setShowDeleteDialog] = useState(false)
      const [isDeleting, setIsDeleting] = useState(false)
      const po = row.original
      const { toast } = useToast()
      const { updatePurchaseOrder, removePurchaseOrder } = usePurchaseOrderStore()

      const handleStatusUpdate = async (newStatus: POStatus) => {
        const result = await updatePurchaseOrderStatus(po.id, newStatus)
        if (result.success) {
          updatePurchaseOrder(result.purchaseOrder)
          toast({
            title: "Success",
            description: `Purchase order status updated to ${newStatus.toLowerCase()}`,
          })
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        }
      }

      const handleDelete = async () => {
        setIsDeleting(true)
        const result = await deletePurchaseOrder(po.id)
        if (result.success) {
          removePurchaseOrder(po.id)
          toast({
            title: "Success",
            description: "Purchase order deleted successfully",
          })
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        }
        setIsDeleting(false)
        setShowDeleteDialog(false)
      }

      const getAvailableStatusTransitions = (currentStatus: POStatus): POStatus[] => {
        switch (currentStatus) {
          case 'DRAFT':
            return ['SENT']
          case 'SENT':
            return ['APPROVED', 'REJECTED']
          case 'APPROVED':
            return ['COMPLETED']
          default:
            return []
        }
      }

      const availableTransitions = getAvailableStatusTransitions(po.status)

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                Edit
              </DropdownMenuItem>
              {availableTransitions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                >
                  Update to {status.toLowerCase()}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {showEditModal && (
            <EditPOModal
              purchaseOrder={po}
              onClose={() => setShowEditModal(false)}
            />
          )}

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the purchase order.
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