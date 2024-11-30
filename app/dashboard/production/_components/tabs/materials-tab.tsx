import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Production, MaterialUsage, MaterialQualityStatus } from '@/types/production'
import { AddMaterialModal } from '../add-material-modal'

interface MaterialsTabProps {
  production: Production
}

export function MaterialsTab({ production }: MaterialsTabProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const materials = production.materialUsage || []

  const getQualityStatusColor = (status: MaterialQualityStatus) => {
    switch (status) {
      case 'GOOD':
        return 'bg-green-100 text-green-800'
      case 'DAMAGED':
      case 'CONTAMINATED':
        return 'bg-red-100 text-red-800'
      case 'EXPIRED':
        return 'bg-yellow-100 text-yellow-800'
      case 'BELOW_STANDARD':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Materials Used</h3>
        <Button onClick={() => setShowAddModal(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Material
        </Button>
      </div>

      <div className="grid gap-4">
        {materials.map((material: MaterialUsage) => (
          <Card key={material.id}>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">
                {material.material?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Quantity:</span>{' '}
                  {material.actualQuantity} {material.unit}
                </div>
                <div>
                  <span className="text-muted-foreground">Cost:</span>{' '}
                  ${material.totalCost.toFixed(2)}
                </div>
                <div>
                  <span className="text-muted-foreground">Quality:</span>{' '}
                  <Badge className={getQualityStatusColor(material.qualityStatus)}>
                    {material.qualityStatus.replace('_', ' ')}
                  </Badge>
                </div>
                {material.wasteQuantity && (
                  <div>
                    <span className="text-muted-foreground">Waste:</span>{' '}
                    {material.wasteQuantity} {material.unit}
                  </div>
                )}
              </div>
              {material.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{material.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}

        {materials.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No materials recorded yet
          </p>
        )}
      </div>

      {showAddModal && (
        <AddMaterialModal
          productionId={production.id}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}