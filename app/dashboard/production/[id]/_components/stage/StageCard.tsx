'use client'
import { Stage, StageStatus } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { ResourceList } from '../resource-list'
import { LaborList } from '../labor-list'

interface StageCardProps {
  stage: Stage & {
    resources: any[]
    labor: any[]
  }
  workers: any[]
  onEdit: (stage: Stage) => void
  onDelete: (stage: Stage) => void
  onResourceChange: () => void
}

export function StageCard({ stage, workers, onEdit, onDelete, onResourceChange }: StageCardProps) {
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
    <AccordionItem value={stage.id} className="border rounded-lg shadow-sm">
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
                    onResourceChange={onResourceChange}
                  />
                </div>
                
                <Separator className="my-8" />
                
                <div>
                  <LaborList 
                    stageId={stage.id}
                    laborEntries={stage.labor}
                    workers={workers}
                    onLaborChange={onResourceChange}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => onEdit(stage)}
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit Stage
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(stage)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete Stage
                </Button>
              </div>
            </div>
          </CardContent>
        </AccordionContent>
      </Card>
    </AccordionItem>
  )
}