import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Production, QualityCheck, QualityStatus } from '@/types/production'
import { AddQualityCheckModal } from '../add-quality-check-modal'

interface QualityTabProps {
  production: Production
}

export function QualityTab({ production }: QualityTabProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const checks = production.qualityChecks || []

  const getStatusColor = (status: QualityStatus) => {
    switch (status) {
      case 'PASSED':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      case 'NEEDS_REVIEW':
        return 'bg-yellow-100 text-yellow-800'
      case 'PENDING':
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Quality Checks</h3>
        <Button onClick={() => setShowAddModal(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Quality Check
        </Button>
      </div>

      <div className="grid gap-4">
        {checks.map((check: QualityCheck) => (
          <Card key={check.id}>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">
                {check.checkType.replace('_', ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <Badge className={getStatusColor(check.status)}>
                    {check.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Checked By:</span>{' '}
                  {check.checkedBy}
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>{' '}
                  {new Date(check.checkedAt).toLocaleString()}
                </div>
              </div>
              {check.notes && (
                <p className="mt-2 text-sm text-muted-foreground">{check.notes}</p>
              )}
            </CardContent>
          </Card>
        ))}

        {checks.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No quality checks recorded yet
          </p>
        )}
      </div>

      {showAddModal && (
        <AddQualityCheckModal
          productionId={production.id}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}