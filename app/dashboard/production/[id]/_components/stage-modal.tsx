'use client'
import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { createStage, updateStage, type CreateStageInput } from '@/app/actions/stage'
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Stage, StageStatus } from '@prisma/client'

const stageSchema = z.object({
  name: z.string().min(2, 'Stage name must be at least 2 characters'),
  description: z.string().optional(),
  status: z.string(),
  order: z.number().min(1),
})

type StageFormValues = z.infer<typeof stageSchema>

interface StageModalProps {
  productionId: string
  stage?: Stage
  onClose?: () => void
  onSuccess?: () => void
}

export function StageModal({ productionId, stage, onClose, onSuccess }: StageModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<StageFormValues>({
    resolver: zodResolver(stageSchema),
    defaultValues: {
      name: stage?.name || '',
      description: stage?.description || '',
      status: stage?.status || 'PENDING',
      order: stage?.order || 1,
    },
  })

  async function onSubmit(data: StageFormValues) {
    setIsLoading(true)
    const stageInput: CreateStageInput = {
      ...data,
      productionId,
    }

    const result = stage 
      ? await updateStage(stage.id, stageInput)
      : await createStage(stageInput)
    
    if (result.success) {
      toast({
        title: `Stage ${stage ? 'updated' : 'created'}!`,
        description: `Stage has been ${stage ? 'updated' : 'created'} successfully.`,
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
          <DialogTitle>{stage ? 'Edit' : 'Add'} Stage</DialogTitle>
          <DialogDescription>
            {stage ? 'Make changes to the' : 'Add a new'} production stage.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stage Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter stage name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe this stage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="ON_HOLD">On Hold</SelectItem>
                      <SelectItem value="SKIPPED">Skipped</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {stage ? 'Update' : 'Create'} Stage
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}