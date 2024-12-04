'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { StageList } from './_components/stage-list'
import { OutputList } from './_components/output-list'
import { useToast } from '@/hooks/use-toast'
import { getProductionWithDetails } from '@/app/actions/production'
import { getProductionOutputs } from '@/app/actions/production-output'
import { LoadingScreen } from '@/components/loading-screen'
import { Separator } from '@/components/ui/separator'
import { ProductionHeader } from './_components/production-header'
import { StatusCards } from './_components/status-cards'

interface StageWithDetails {
  id: string
  name: string
  description?: string
  startDate?: Date
  endDate?: Date
  status: string
  order: number
  productionId: string
  notes?: string
  createdAt: Date
  updatedAt: Date
  resources: Array<{
    cost: number | null
    quantity: number
  }>
  labor: Array<{
    rate: number | null
    hours: number | null
    days: number | null
    periodType: 'HOURLY' | 'DAILY' | 'MONTHLY'
  }>
}

interface ProductionWithDetails {
  id: string
  batchNumber: string
  productName: string
  startDate: Date
  endDate: Date | null
  status: string
  businessId: string
  productId: string | null
  stages: StageWithDetails[]
  createdAt: Date
  updatedAt: Date
}

const ProductionDetail = () => {
  const params = useParams()
  const { toast } = useToast()
  const [production, setProduction] = useState<ProductionWithDetails | null>(null)
  const [outputs, setOutputs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
    }
  }

  const fetchOutputs = async () => {
    try {
      const result = await getProductionOutputs(params.id as string)
      if (result.success) {
        setOutputs(result.outputs)
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load production outputs'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduction()
    fetchOutputs()
  }, [params.id])

  if (loading) {
    return <LoadingScreen />
  }

  if (!production) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-lg text-muted-foreground">Production not found</div>
      </div>
    )
  }

  // Calculate total costs (resources + labor)
  const resourceCosts = production.stages.reduce((total, stage) => {
    return total + stage.resources.reduce((stageTotal, resource) => {
      return stageTotal + (resource.cost || 0) * resource.quantity
    }, 0)
  }, 0)

  const laborCosts = production.stages.reduce((total, stage) => {
    return total + stage.labor.reduce((stageTotal, labor) => {
      const rate = labor.rate || 0
      if (labor.periodType === 'HOURLY') {
        return stageTotal + rate * (labor.hours || 0)
      } else if (labor.periodType === 'DAILY') {
        return stageTotal + rate * (labor.days || 0)
      } else if (labor.periodType === 'MONTHLY') {
        return stageTotal + (rate || 0)
      }
      return stageTotal
    }, 0)
  }, 0)

  const totalCosts = resourceCosts + laborCosts

  return (
    <div className="mx-auto px-0 md:px-4 py-6 space-y-8">
      <ProductionHeader 
        productName={production.productName}
        batchNumber={production.batchNumber}
      />

      <StatusCards 
        status={production.status}
        startDate={production.startDate}
        endDate={production.endDate}
      />

      <StageList 
        productionId={production.id} 
        onStageChange={fetchProduction}
      />
      
      <Separator className="my-8" />
      
      <OutputList 
        productionId={production.id}
        outputs={outputs}
        onOutputChange={fetchOutputs}
        totalCosts={totalCosts}
        resourceCosts={resourceCosts}
        laborCosts={laborCosts}
        stages={production.stages}
      />
    </div>
  )
}

export default ProductionDetail