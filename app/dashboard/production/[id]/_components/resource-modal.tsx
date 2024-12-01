'use client'
import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { createResource, updateResource, type CreateResourceInput } from '@/app/actions/resource'
import { Loader2 } from "lucide-react"
import { Resource, ResourceType } from '@prisma/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const resourceSchema = z.object({
  name: z.string().min(2, 'Resource name must be at least 2 characters'),
  type: z.nativeEnum(ResourceType),
  quantity: z.number().min(0),
  unit: z.string().min(1, 'Unit is required'),
  cost: z.number().optional(),
})

type ResourceFormValues = z.infer<typeof resourceSchema>

interface ResourceModalProps {
  stageId: string
  resource?: Resource
  onClose?: () => void
  onSuccess?: () => void
}

export function ResourceModal({ stageId, resource, onClose, onSuccess }: ResourceModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      name: resource?.name || '',
      type: (resource?.type as ResourceType) || ResourceType.RAW_MATERIAL,
      quantity: resource?.quantity || 0,
      unit: resource?.unit || '',
      cost: Number(resource?.cost) || 0,
    },
  })

  async function onSubmit(data: ResourceFormValues) {
    setIsLoading(true)
    const resourceInput: CreateResourceInput = {
      name: data.name,
      type: data.type as ResourceType,
      quantity: data.quantity,
      unit: data.unit,
      cost: data.cost,
      stageId,
    }

    const result = resource 
      ? await updateResource(resource.id, resourceInput)
      : await createResource(resourceInput)
    
    if (result.success) {
      toast({
        title: `Resource ${resource ? 'updated' : 'created'}!`,
        description: `Resource has been ${resource ? 'updated' : 'created'} successfully.`,
      })
      onSuccess?.()
      onClose?.()
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      })
    }
    setIsLoading(false)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{resource ? 'Edit' : 'Add'} Resource</DialogTitle>
          <DialogDescription>
            {resource ? 'Make changes to the' : 'Add a new'} resource.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter resource name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ResourceType.RAW_MATERIAL}>Raw Material</SelectItem>
                      <SelectItem value={ResourceType.EQUIPMENT}>Equipment</SelectItem>
                      <SelectItem value={ResourceType.SUPPLIES}>Supplies</SelectItem>
                      <SelectItem value={ResourceType.UTILITIES}>Utilities</SelectItem>
                      <SelectItem value={ResourceType.CHEMICALS}>Chemicals</SelectItem>
                      <SelectItem value={ResourceType.OTHER}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      step="0.01"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., kg, liters, pieces" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="Enter cost"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {resource ? 'Update' : 'Add'} Resource
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}