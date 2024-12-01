'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StageList } from './_components/stage-list'
import { useToast } from '@/hooks/use-toast'
import { Production, Stage } from '@prisma/client'
import { getProductionWithDetails } from '@/app/actions/production'
import { ArrowLeft } from 'lucide-react'

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
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{production.productName || 'Unnamed Production'}</h2>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{production.status}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Start Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {new Date(production.startDate).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">End Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
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