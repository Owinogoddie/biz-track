'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FundingOverviewCards } from './_components/funding-overview-cards'
import { FundingTransactions } from './_components/funding-transactions'
import { FundingExpenditures } from './_components/funding-expenditures'
import { getFundingSourceDetails } from '@/app/actions/funding-source/funding-source-details'

const FundingDetailsPage = () => {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [fundingDetails, setFundingDetails] = useState<any>(null)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result = await getFundingSourceDetails(params.id as string)
        if (result.success) {
          setFundingDetails(result.fundingSource)
        }
      } catch (error) {
        console.error('Failed to fetch funding details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [params.id])

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[180px]" />
          ))}
        </div>
      </div>
    )
  }

  if (!fundingDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Funding Source Not Found</h2>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  const totalSpent = fundingDetails.expenditures.reduce((sum: number, exp: any) => sum + exp.amount, 0)
  const remainingAmount = fundingDetails.amount - totalSpent
  const utilizationPercentage = (totalSpent / fundingDetails.amount) * 100

  return (
    <div className="space-y-6 p-6 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Funding Sources
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{fundingDetails.name}</h2>
          <p className="text-muted-foreground">
            Detailed overview of your funding source
          </p>
        </div>
      </div>

      <FundingOverviewCards
        fundingDetails={fundingDetails}
        totalSpent={totalSpent}
        utilizationPercentage={utilizationPercentage}
        remainingAmount={remainingAmount}
      />

      <div className="space-y-6">
        <FundingExpenditures expenditures={fundingDetails.expenditures} />
        <FundingTransactions transactions={fundingDetails.transactions} />
      </div>
    </div>
  )
}

export default FundingDetailsPage