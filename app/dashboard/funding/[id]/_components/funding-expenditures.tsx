'use client'

import { format } from 'date-fns'
import { formatCurrency } from '@/lib/formatters'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface Expenditure {
  id: string
  amount: number
  category: string
  description: string
  date: Date
}

interface FundingExpendituresProps {
  expenditures: Expenditure[]
}

export function FundingExpenditures({ expenditures }: FundingExpendituresProps) {
  if (!expenditures.length) return null

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="expenditures">
        <AccordionTrigger className="text-lg font-semibold">
          Expenditures ({expenditures.length})
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            {expenditures.map((expenditure) => (
              <div
                key={expenditure.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="font-medium">{expenditure.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{expenditure.category}</span>
                    <span>•</span>
                    <span>{format(new Date(expenditure.date), 'PPP')}</span>
                  </div>
                </div>
                <p className="font-bold text-destructive">
                  {formatCurrency(expenditure.amount)}
                </p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}