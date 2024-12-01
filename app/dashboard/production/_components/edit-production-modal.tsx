import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useProductionStore } from '@/store/useProductionStore'
import { updateProduction } from '@/app/actions/production'
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const productionSchema = z.object({
  batchNumber: z.string().min(2, 'Batch number must be at least 2 characters'),
  productName: z.string().min(2, 'Product name must be at least 2 characters'),
  startDate: z.string(),
  status: z.string(),
})

type ProductionFormValues = z.infer<typeof productionSchema>

interface EditProductionModalProps {
  production: any
  onClose?: () => void
}

export function EditProductionModal({ production, onClose }: EditProductionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { updateProduction: updateProductionStore } = useProductionStore()

  const form = useForm<ProductionFormValues>({
    resolver: zodResolver(productionSchema),
    defaultValues: {
      batchNumber: production.batchNumber,
      productName: production.productName,
      startDate: new Date(production.startDate).toISOString().split('T')[0],
      status: production.status,
    },
  })

  async function onSubmit(data: ProductionFormValues) {
    setIsLoading(true)
    const result = await updateProduction(production.id, {
      ...data,
      startDate: new Date(data.startDate),
      businessId: production.businessId,
    })
    
    if (result.success) {
      updateProductionStore(result.production)
      toast({
        title: 'Production updated!',
        description: 'Production details have been updated successfully.',
      })
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
          <DialogTitle>Edit Production</DialogTitle>
          <DialogDescription>
            Update the production details and status.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="batchNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter batch number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productName"
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
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
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
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Production
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}