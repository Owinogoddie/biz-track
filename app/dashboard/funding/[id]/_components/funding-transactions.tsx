'use client'

import { format } from 'date-fns'
import { formatCurrency } from '@/lib/formatters'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface Transaction {
  id: string
  type: string
  status: string
  total: number
  paid: number
  notes?: string
  customer?: { name: string } | null
  supplier?: { name: string } | null
  items: Array<{
    id: string
    quantity: number
    price: number
    total: number
    product: {
      name: string
    }
  }>
  createdAt: Date
}

interface FundingTransactionsProps {
  transactions: Transaction[]
}

export function FundingTransactions({ transactions }: FundingTransactionsProps) {
  if (!transactions.length) return null

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="transactions">
        <AccordionTrigger className="text-lg font-semibold">
          Transactions ({transactions.length})
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">
                      {transaction.customer?.name || transaction.supplier?.name || 'General Transaction'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.createdAt), 'PPP')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {transaction.type.toLowerCase()}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {transaction.status.toLowerCase()}
                    </Badge>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transaction.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(transaction.total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {transaction.notes && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Note: {transaction.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}