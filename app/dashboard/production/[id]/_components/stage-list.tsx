'use client'

import { useState, useEffect } from 'react'
import { Stage, StageStatus, Resource, Labor, Worker } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { StageModal } from './stage-modal'
import { deleteStage, getStages } from '@/app/actions/stage'
import { getWorkers } from '@/app/actions/worker'
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
import { ResourceList } from './resource-list'
import { LaborList } from './labor-list'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from '@/components/ui/separator'

interface StageListProps {
  productionId: string
  onStageChange: () => void
}

type StageWithDetails = Stage & {
  resources: Resource[]
  labor: (Labor & { worker: Worker })[]
}

export function StageList({ productionId, onStageChange }: StageListProps) {
  const [stages, setStages] = useState<StageWithDetails[]>([])
  const [workers, setWorkers] = useState<Worker[]>([])
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null)
  const [showStageModal, setShowStageModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const fetchStages = async () => {
    const result = await getStages(productionId)
    if (result.success) {
      setStages(result.stages)
      onStageChange()
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to load stages'
      })
    }
  }

  const fetchWorkers = async () => {
    const result = await getWorkers()
    if (result.success) {
      setWorkers(result.workers)
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to load workers'
      })
    }
  }

  useEffect(() => {
    fetchStages()
    fetchWorkers()
  }, [productionId])

  const handleDelete = async () => {
    if (!selectedStage) return

    setIsDeleting(true)
    const result = await deleteStage(selectedStage.id)
    
    if (result.success) {
      await fetchStages()
      toast({
        title: 'Stage deleted',
        description: 'Stage has been deleted successfully.',
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
    setSelectedStage(null)
  }

  const getStatusColor = (status: StageStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600'
      case 'IN_PROGRESS':
        return 'text-blue-600'
      case 'ON_HOLD':
        return 'text-yellow-600'
      case 'SKIPPED':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="mx-auto py-6 w-full max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl md:text-2xl font-bold">Production Stages</h3>
        <Button 
          onClick={() => {
            setSelectedStage(null)
            setShowStageModal(true)
          }}
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" /> Add Stage
        </Button>
      </div>
      
      <Accordion type="single" collapsible className="space-y-6">
        {stages.map((stage) => (
          <AccordionItem key={stage.id} value={stage.id} className="border rounded-lg shadow-sm">
            <Card className="border-0 shadow-none">
              <CardHeader className="p-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <CardTitle className="flex justify-between w-full items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-xl">{stage.name}</span>
                      <span className={`${getStatusColor(stage.status)} px-3 py-1 rounded-full text-sm font-medium`}>
                        {stage.status}
                      </span>
                    </div>
                  </CardTitle>
                </AccordionTrigger>
              </CardHeader>
              <AccordionContent>
                <CardContent className="px-6 py-4">
                  <div className="space-y-8">
                    {stage.description && (
                      <p className="text-muted-foreground">{stage.description}</p>
                    )}
                    
                    <div className="space-y-8">
                      <div>
                        <ResourceList 
                          stageId={stage.id} 
                          resources={stage.resources}
                          onResourceChange={fetchStages}
                        />
                      </div>
                      
                      <Separator className="my-8" />
                      
                      <div>
                        <LaborList 
                          stageId={stage.id}
                          laborEntries={stage.labor}
                          workers={workers}
                          onLaborChange={fetchStages}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-[5px] pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedStage(stage)
                          setShowStageModal(true)
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-[2px]" /> Edit Stage
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedStage(stage)
                          setShowDeleteDialog(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-[2px]" /> Delete Stage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
      
      {showStageModal && (
        <StageModal
          productionId={productionId}
          stage={selectedStage || undefined}
          onClose={() => {
            setShowStageModal(false)
            setSelectedStage(null)
          }}
          onSuccess={fetchStages}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the stage.
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