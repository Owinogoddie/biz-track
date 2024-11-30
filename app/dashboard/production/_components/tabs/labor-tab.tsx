import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Production, LaborRecord } from '@/types/production'
import { AddLaborModal } from '../add-labor-modal'

interface LaborTabProps {
  production: Production
}

export function LaborTab({ production }: LaborTabProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const records = production.laborRecords || []

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Labor Records</h3>
        <Button onClick={() => setShowAddModal(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Labor Record
        </Button>
      </div>

      <div className="grid gap-4">
        {records.map((record: LaborRecord) => (
          <Card key={record.id}>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">
                {record.workerName} - {record.taskType.replace('_', ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Hours:</span>{' '}
                  {record.hoursWorked}
                </div>
                <div>
                  <span className="text-muted-foreground">Cost:</span>{' '}
                  ${record.totalCost.toFixed(2)}
                </div>
                <div>
                  <span className="text-muted-foreground">Start:</span>{' '}
                  {new Date(record.startTime).toLocaleString()}
                </div>
                {record.endTime && (
                  <div>
                    <span className="text-muted-foreground">End:</span>{' '}
                    {new Date(record.endTime).toLocaleString()}
                  </div>
                )}
              </div>
              {record.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{record.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}

        {records.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No labor records added yet
          </p>
        )}
      </div>

      {showAddModal && (
        <AddLaborModal
          productionId={production.id}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}