'use client'

import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CostBreakdownProps {
  resourceCosts: number
  laborCosts: number
  totalCosts: number
  resourceBreakdown: Array<{
    name: string
    quantity: number
    unit: string
    cost: number
    total: number
  }>
  laborBreakdown: Array<{
    name: string
    hours: number
    days: number
    rate: number
    periodType: string
    total: number
  }>
}

export function CostBreakdown({
  resourceCosts,
  laborCosts,
  totalCosts,
  resourceBreakdown,
  laborBreakdown
}: CostBreakdownProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="cost-breakdown" className="border-none">
        <Card className="mb-6">
          <CardHeader className="pb-0">
            <AccordionTrigger className="hover:no-underline">
              <CardTitle>Cost Breakdown</CardTitle>
            </AccordionTrigger>
          </CardHeader>
          <AccordionContent>
            <CardContent className="space-y-6 pt-6">
              <div>
                <h4 className="font-semibold mb-2">Resource Costs (Total: Ksh {resourceCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</h4>
                {resourceBreakdown.map((resource, index) => (
                  <div key={index} className="ml-4 text-sm">
                    {resource.name}: {resource.quantity} {resource.unit} at Ksh {resource.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                    = Ksh {resource.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">Labor Costs (Total: Ksh {laborCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</h4>
                {laborBreakdown.map((labor, index) => (
                  <div key={index} className="ml-4 text-sm">
                    {labor.name}: {labor.periodType === 'HOURLY' 
                      ? `${labor.hours} hours × Ksh ${labor.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : labor.periodType === 'DAILY'
                      ? `${labor.days} days × Ksh ${labor.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : `Monthly rate: Ksh ${labor.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    } = Ksh {labor.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                ))}
              </div>

              <Separator />

              <div className="font-semibold">
                Total Costs: Resource Costs + Labor Costs = Ksh {resourceCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                + Ksh {laborCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                = Ksh {totalCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </AccordionContent>
        </Card>
      </AccordionItem>
    </Accordion>
  )
}