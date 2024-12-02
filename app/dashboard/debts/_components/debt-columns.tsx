import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Phone } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header'
import { Debt, Payment, Transaction } from '@prisma/client'

export interface DebtWithTransaction extends Debt {
  transaction: Transaction & {
    payments: Payment[]
  }
}

export const columns: ColumnDef<DebtWithTransaction>[] = [
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.customerName}</div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="mr-1 h-3 w-3" />
            {row.original.customerPhoneNumber}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const paid = row.original.transaction.payments.reduce(
        (sum, payment) => sum + payment.amount, 
        0
      )
      const isPaid = paid >= row.original.amount
      
      return (
        <div>
          <div className="font-medium">
            {formatCurrency(row.original.amount)}
          </div>
          <div className="text-sm text-muted-foreground">
            Paid: {formatCurrency(paid)}
          </div>
          {isPaid && (
            <Badge variant="success" className="mt-1">
              Fully Paid
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('dueDate'))
      const isOverdue = date < new Date() && row.original.status === 'PENDING'
      return (
        <div className="font-medium">
          {date.toLocaleDateString()}
          {isOverdue && (
            <Badge variant="destructive" className="ml-2">
              Overdue
            </Badge>
          )}
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
      return (
        <Badge
          variant={row.original.status === 'PAID' ? 'default' : 'secondary'}
        >
          {row.original.status}
        </Badge>
      )
    },
  },
]