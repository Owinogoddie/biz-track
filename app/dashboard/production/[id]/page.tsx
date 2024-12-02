'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StageList } from './_components/stage-list'
import { useToast } from '@/hooks/use-toast'
import { Production, Stage } from '@prisma/client'
import { getProductionWithDetails } from '@/app/actions/production'
import { ArrowRight, ArrowUp, ArrowDown ,ArrowLeft} from "lucide-react";
const ProductionDetail = () => {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [production, setProduction] = useState<Production & { stages: Stage[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduction = async () => {
      try {
        const result = await getProductionWithDetails(params.id as string)
        if (result.success) {
          setProduction(result.production)
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error
          })
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load production details'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduction()
  }, [params.id, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!production) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-lg text-muted-foreground">Production not found</div>
      </div>
    )
  }

  return (
    <div className="mx-auto px-0 md:px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text xl md:text-2xl font-bold tracking-tight">{production.productName || 'Unnamed Production'}</h2>
          <p className="text-muted-foreground">
            Batch Number: {production.batchNumber}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/productions')}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Productions
        </Button>
      </div>

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
            {production.status}
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
            {new Date(production.startDate).toLocaleDateString()}
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
            {production.endDate 
              ? new Date(production.endDate).toLocaleDateString()
              : 'Not completed'}
          </div>
        </CardContent>
      </Card>
    </div>

      <StageList productionId={production.id} />
    </div>
  )
}

export default ProductionDetail