'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, ArrowUp, ArrowDown } from "lucide-react"

interface StatusCardsProps {
  status: string
  startDate: Date
  endDate: Date | null
}

export function StatusCards({ status, startDate, endDate }: StatusCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold tracking-tight">
            {status}
          </div>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
            Start Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold tracking-tight">
            {new Date(startDate).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 lg:col-span-1 group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        <CardHeader className="space-y-1 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ArrowDown className="w-5 h-5 md:w-6 md:h-6" />
            End Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold tracking-tight">
            {endDate 
              ? new Date(endDate).toLocaleDateString()
              : 'Not completed'}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}