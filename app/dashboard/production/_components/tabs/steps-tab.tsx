import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Production, ProductionStep, ProductionStatus } from '@/types/production'
import { AddStepModal } from '../add-step-modal'

interface StepsTabProps {
  production: Production
}

export function StepsTab({ production }: StepsTabProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const steps = production.steps || []

  const getStatusColor = (status: ProductionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'ON_HOLD':
        return 'bg-orange-100 text-orange-800'
      case 'PLANNED':
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Production Steps</h3>
        <Button onClick={() => setShowAddModal(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Step
        </Button>
      </div>

      <div className="grid gap-4">
        {steps.map((step: ProductionStep) => (
          <Card key={step.id}>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">
                {step.orderIndex}. {step.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <Badge className={getStatusColor(step.status)}>
                    {step.status.replace('_', ' ')}
                  </Badge>
                </div>
                {step.startDate && (
                  <div>
                    <span className="text-muted-foreground">Started:</span>{' '}
                    {new Date(step.startDate).toLocaleString()}
                  </div>
                )}
                {step.endDate && (
                  <div>
                    <span className="text-muted-foreground">Completed:</span>{' '}
                    {new Date(step.endDate).toLocaleString()}
                  </div>
                )}
              </div>
              {step.description && (
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              )}
              {step.result && (
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">Result: </span>
                  <span className="text-sm">{step.result}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {steps.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No steps added yet
          </p>
        )}
      </div>

      {showAddModal && (
        <AddStepModal
          productionId={production.id}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}