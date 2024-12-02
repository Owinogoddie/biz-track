'use client'
import { useState } from 'react'
import { Labor, Worker, PaymentPeriod } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, Calendar, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { LaborModal } from './labor-modal'
import { deleteLabor } from '@/app/actions/labor'
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
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/formatters'

interface LaborListProps {
  stageId: string
  laborEntries: (Labor & { worker: Worker })[]
  workers: Worker[]
  onLaborChange: () => void
}

export function LaborList({ stageId, laborEntries, workers, onLaborChange }: LaborListProps) {
  const [selectedLabor, setSelectedLabor] = useState<(Labor & { worker: Worker }) | null>(null)
  const [showLaborModal, setShowLaborModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!selectedLabor) return

    setIsDeleting(true)
    const result = await deleteLabor(selectedLabor.id)
    
    if (result.success) {
      onLaborChange()
      toast({
        title: 'Labor entry deleted',
        description: 'Labor entry has been deleted successfully.',
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
    setSelectedLabor(null)
  }

  const formatPeriodValue = (labor: Labor) => {
    switch (labor.periodType) {
      case 'HOURLY':
        return `${labor.hours} hours`
      case 'DAILY':
        return `${labor.days} days`
      case 'MONTHLY':
        return 'Monthly'
      default:
        return ''
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Labor Tracking</h3>
        <Button 
          variant="outline"
          onClick={() => {
            setSelectedLabor(null)
            setShowLaborModal(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Labor Entry
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {laborEntries.map((labor) => (
          <Card key={labor.id} className="border shadow-sm flex-grow basis-[calc(100%-1rem)] sm:basis-[calc(50%-1rem)] lg:basis-[calc(33.333%-1rem)]">
            <CardHeader className="p-4">
              <CardTitle className="flex justify-between items-center text-base flex-wrap gap-2">
                <span className="break-all">
                  {labor.worker.firstName} {labor.worker.lastName}
                  {labor.worker.isCasual && (
                    <Badge variant="outline" className="ml-2">
                      Casual
                    </Badge>
                  )}
                </span>
                <Badge variant="secondary">
                  {labor.periodType.toLowerCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(labor.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatPeriodValue(labor)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rate</p>
                  <p className="font-medium">{formatCurrency(labor.rate)} ({labor.periodType.toLowerCase()})</p>
                </div>
                {labor.notes && (
                  <p className="text-sm text-muted-foreground border-t pt-2 break-words">{labor.notes}</p>
                )}
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedLabor(labor)
                      setShowLaborModal(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setSelectedLabor(labor)
                      setShowDeleteDialog(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {showLaborModal && (
        <LaborModal
          stageId={stageId}
          workers={workers}
          labor={selectedLabor || undefined}
          onClose={() => {
            setShowLaborModal(false)
            setSelectedLabor(null)
          }}
          onSuccess={onLaborChange}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this labor entry.
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