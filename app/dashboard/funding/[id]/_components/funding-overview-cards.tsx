'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Building2, FileText, Clock } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/formatters'

interface FundingOverviewCardsProps {
  fundingDetails: {
    amount: number
    provider: string
    type: string
    status?: string
  }
  totalSpent: number
  utilizationPercentage: number
  remainingAmount: number
}

export function FundingOverviewCards({
  fundingDetails,
  totalSpent,
  utilizationPercentage,
  remainingAmount,
}: FundingOverviewCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(fundingDetails.amount)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Provider</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{fundingDetails.provider}</div>
          <p className="text-xs text-muted-foreground">
            Type: {fundingDetails.type.replace('_', ' ')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {fundingDetails.status?.toLowerCase() || 'Active'}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fund Utilization</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {formatCurrency(totalSpent)} used of {formatCurrency(fundingDetails.amount)}
              </span>
              <span className="text-sm text-muted-foreground">
                {utilizationPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={utilizationPercentage} className="h-2" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Amount Spent</p>
              <p className="text-xl font-bold text-destructive">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Remaining Amount</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(remainingAmount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}