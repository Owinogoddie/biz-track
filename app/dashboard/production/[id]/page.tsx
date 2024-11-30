"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Production } from '@/types/production'
import { getProductions } from '@/app/actions/production'
import { MaterialsTab } from '../_components/tabs/materials-tab'
import { LaborTab } from '../_components/tabs/labor-tab'
import { QualityTab } from '../_components/tabs/quality-tab'
import { StepsTab } from '../_components/tabs/steps-tab'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { EditProductionModal } from '../_components/EditProductionModal'

export default function ProductionPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { toast } = useToast()
  const [production, setProduction] = useState<Production | null>(null)
  const { currentBusiness } = useBusinessStore()
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    const fetchProduction = async () => {
      if (!currentBusiness) return
      
      const result = await getProductions(currentBusiness.id)
      if (result.success) {
        const found = result.productions.find(p => p.id === id)
        if (found) {
          setProduction(found)
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Production not found'
          })
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch production details'
        })
      }
    }

    fetchProduction()
  }, [currentBusiness, id, toast])

  const handleEditSuccess = () => {
    // Refresh the production data after successful edit
    if (currentBusiness) {
      getProductions(currentBusiness.id).then(result => {
        if (result.success) {
          const updated = result.productions.find(p => p.id === id)
          if (updated) {
            setProduction(updated)
          }
        }
      })
    }
  }

  if (!production) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{production.name}</h1>
          <p className="text-muted-foreground">{production.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowEditModal(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Back to Productions
          </Button>
        </div>
      </div>

      {showEditModal && (
        <EditProductionModal
          production={production}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Production Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium">{production.status}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Target Quantity</p>
            <p className="font-medium">{production.targetQuantity || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Actual Quantity</p>
            <p className="font-medium">{production.actualQuantity || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Cost</p>
            <p className="font-medium">${production.actualCost?.toFixed(2) || 'N/A'}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="labor">Labor</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
        </TabsList>
        
        <TabsContent value="materials">
          <MaterialsTab production={production} />
        </TabsContent>
        
        <TabsContent value="labor">
          <LaborTab production={production} />
        </TabsContent>
        
        <TabsContent value="quality">
          <QualityTab production={production} />
        </TabsContent>
        
        <TabsContent value="steps">
          <StepsTab production={production} />
        </TabsContent>
      </Tabs>
    </div>
  )
}