'use client'
import { useState } from 'react'
import { Resource, ResourceType } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ResourceModal } from './resource-modal'
import { deleteResource } from '@/app/actions/resource'
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
import { Badge } from "@/components/ui/badge"

interface ResourceListProps {
  stageId: string
  resources: Resource[]
  onResourceChange: () => void
}

export function ResourceList({ stageId, resources, onResourceChange }: ResourceListProps) {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!selectedResource) return

    setIsDeleting(true)
    const result = await deleteResource(selectedResource.id)
    
    if (result.success) {
      onResourceChange()
      toast({
        title: 'Resource deleted',
        description: 'Resource has been deleted successfully.',
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
    setSelectedResource(null)
  }

  const getResourceTypeColor = (type: ResourceType) => {
    switch (type) {
      case 'RAW_MATERIAL':
        return 'bg-blue-100 text-blue-800'
      case 'EQUIPMENT':
        return 'bg-green-100 text-green-800'
      case 'SUPPLIES':
        return 'bg-yellow-100 text-yellow-800'
      case 'UTILITIES':
        return 'bg-purple-100 text-purple-800'
      case 'CHEMICALS':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Resources</h3>
        <Button 
          variant="outline"
          onClick={() => {
            setSelectedResource(null)
            setShowResourceModal(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Resource
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {resources.map((resource) => (
          <Card key={resource.id} className="border shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="flex justify-between items-center text-base">
                <span>{resource.name}</span>
                <Badge variant="secondary" className={getResourceTypeColor(resource.type)}>
                  {resource.type.replace('_', ' ')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{resource.quantity} {resource.unit}</p>
                  </div>
                  {resource.cost && (
                    <div>
                      <p className="text-sm text-muted-foreground">Cost</p>
                      <p className="font-medium">${resource.cost.toString()}</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedResource(resource)
                      setShowResourceModal(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setSelectedResource(resource)
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
      
      {showResourceModal && (
        <ResourceModal
          stageId={stageId}
          resource={selectedResource || undefined}
          onClose={() => {
            setShowResourceModal(false)
            setSelectedResource(null)
          }}
          onSuccess={onResourceChange}
        />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resource.
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