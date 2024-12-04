'use client'

import { useState } from 'react'
import { Plus, Trash2, PenSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { OutputModal } from './output-modal'
import { deleteProductionOutput } from '@/app/actions/production-output'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2 } from "lucide-react"
import { CostBreakdown } from './cost-breakdown'

interface OutputListProps {
  productionId: string
  outputs: any[]
  onOutputChange: () => void
  totalCosts: number
  resourceCosts: number
  laborCosts: number
  stages: any[]
}

export function OutputList({ 
  productionId, 
  outputs, 
  onOutputChange,
  totalCosts,
  resourceCosts,
  laborCosts,
  stages 
}: OutputListProps) {
  const [showModal, setShowModal] = useState(false)
  const [selectedOutput, setSelectedOutput] = useState<any>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!selectedOutput) return

    setIsDeleting(true)
    const result = await deleteProductionOutput(selectedOutput.id)
    
    if (result.success) {
      onOutputChange()
      toast({
        title: 'Output deleted',
        description: 'Production output has been deleted successfully.',
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      })
    }
    setIsDeleting(false)
    setShowDeleteDialog(false)
    setSelectedOutput(null)
  }

  const totalRevenue = outputs.reduce((sum, output) => sum + output.totalValue, 0)
  const profit = totalRevenue - totalCosts
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0

  // Generate cost breakdown details
  const resourceBreakdown = stages.flatMap(stage => 
    stage.resources.map(resource => ({
      name: resource.name,
      quantity: resource.quantity,
      unit: resource.unit,
      cost: resource.cost || 0,
      total: (resource.cost || 0) * resource.quantity
    }))
  )

  const laborBreakdown = stages.flatMap(stage =>
    stage.labor.map(labor => ({
      name: labor.worker 
        ? `${labor.worker.firstName} ${labor.worker.lastName}`
        : `${labor.firstName} ${labor.lastName}`,
      hours: labor.hours || 0,
      days: labor.days || 0,
      rate: labor.rate || 0,
      periodType: labor.periodType,
      total: calculateLaborCost(labor)
    }))
  )

  function calculateLaborCost(labor: any) {
    const rate = labor.rate || 0
    if (labor.periodType === 'HOURLY') {
      return rate * (labor.hours || 0)
    } else if (labor.periodType === 'DAILY') {
      return rate * (labor.days || 0)
    } else if (labor.periodType === 'MONTHLY') {
      return rate
    }
    return 0
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Production Outputs</h3>
        <Button onClick={() => {
          setSelectedOutput(null)
          setShowModal(true)
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add Output
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Ksh {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {outputs.map((output, index) => (
                <div key={index}>
                  {output.quantity} {output.unit} at Ksh {output.pricePerUnit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per {output.unit}
                  = Ksh {output.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profit/Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Ksh {profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Revenue - Total Costs = Ksh {totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
              - Ksh {totalCosts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Profit Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitMargin.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <CostBreakdown
        resourceCosts={resourceCosts}
        laborCosts={laborCosts}
        totalCosts={totalCosts}
        resourceBreakdown={resourceBreakdown}
        laborBreakdown={laborBreakdown}
      />

      <div className="space-y-4">
        {outputs.map((output) => (
          <Card key={output.id}>
            <CardContent className="flex justify-between items-center p-6">
              <div className="space-y-1">
                <h4 className="text-lg font-semibold">{output.name}</h4>
                {output.description && (
                  <p className="text-sm text-muted-foreground">{output.description}</p>
                )}
                <p className="text-sm">
                  {output.quantity} {output.unit} @ Ksh {output.pricePerUnit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per {output.unit}
                </p>
                <p className="text-lg font-semibold text-green-600">
                  Total: Ksh {output.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelectedOutput(output)
                    setShowModal(true)
                  }}
                >
                  <PenSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    setSelectedOutput(output)
                    setShowDeleteDialog(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showModal && (
        <OutputModal
          productionId={productionId}
          output={selectedOutput}
          onClose={() => {
            setShowModal(false)
            setSelectedOutput(null)
          }}
          onSuccess={onOutputChange}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this production output.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}