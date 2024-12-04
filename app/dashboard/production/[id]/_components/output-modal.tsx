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
import { createProductionOutput, updateProductionOutput } from '@/app/actions/production-output'
import { Loader2 } from "lucide-react"

const outputSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  pricePerUnit: z.number().min(0, 'Price must be 0 or greater'),
})

type OutputFormValues = z.infer<typeof outputSchema>

interface OutputModalProps {
  productionId: string
  output?: any
  onClose?: () => void
  onSuccess?: () => void
}

export function OutputModal({ productionId, output, onClose, onSuccess }: OutputModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<OutputFormValues>({
    resolver: zodResolver(outputSchema),
    defaultValues: {
      name: output?.name || '',
      description: output?.description || '',
      quantity: output?.quantity || 0,
      unit: output?.unit || '',
      pricePerUnit: output?.pricePerUnit || 0,
    },
  })

  async function onSubmit(data: OutputFormValues) {
    setIsLoading(true)
    try {
      // Ensure all required fields are present
      const outputData = {
        productionId,
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        unit: data.unit,
        pricePerUnit: data.pricePerUnit
      }

      const result = output
        ? await updateProductionOutput(output.id, outputData)
        : await createProductionOutput(outputData)
      
      if (result.success) {
        toast({
          title: `Output ${output ? 'updated' : 'added'}!`,
          description: `Production output has been ${output ? 'updated' : 'added'} successfully.`,
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
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      })
    }
    setIsLoading(false)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{output ? 'Edit' : 'Add'} Production Output</DialogTitle>
          <DialogDescription>
            {output ? 'Update the details of this output.' : 'Add details about the products produced in this production run.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
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
                    <Textarea placeholder="Describe this product" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
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
                      <Input placeholder="e.g., kg, pieces" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="pricePerUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Unit (Ksh)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
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
              {output ? 'Update' : 'Add'} Output
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}