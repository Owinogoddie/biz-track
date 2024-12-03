import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useInstallmentStore } from '@/store/useInstallmentStore'
import { createInstallmentPlan } from '@/app/actions/installment'
import { Loader2, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateCustomerForm } from './create-customer-form'

const installmentSchema = z.object({
  totalAmount: z.number().min(1, 'Amount must be greater than 0'),
  productId: z.string().min(1, 'Product is required'),
  customerId: z.string().min(1, 'Customer is required'),
  endDate: z.date().optional(),
  notes: z.string().optional(),
})

type InstallmentFormValues = z.infer<typeof installmentSchema>

interface CreateInstallmentModalProps {
  onClose?: () => void
  products: any[]
  customers: any[]
}

export function CreateInstallmentModal({ onClose, products, customers }: CreateInstallmentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const { toast } = useToast()
  const { currentBusiness } = useBusinessStore()
  const { addInstallmentPlan } = useInstallmentStore()

  const form = useForm<InstallmentFormValues>({
    resolver: zodResolver(installmentSchema),
    defaultValues: {
      totalAmount: 0,
      productId: '',
      customerId: '',
      notes: '',
    },
  })

  async function onSubmit(data: InstallmentFormValues) {
    if (!currentBusiness) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No business selected',
      })
      return
    }

    setIsLoading(true)
    const result = await createInstallmentPlan({
      totalAmount: data.totalAmount,
      productId: data.productId,
      customerId: data.customerId,
      businessId: currentBusiness.id,
      endDate: data.endDate,
      notes: data.notes,
    })
    
    if (result.success) {
      addInstallmentPlan(result.plan)
      toast({
        title: 'Installment plan created!',
        description: 'Your installment plan has been created successfully.',
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

  const handleCustomerCreated = (newCustomer: any) => {
    setShowCustomerForm(false)
    form.setValue('customerId', newCustomer.id)
    customers.push(newCustomer)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Installment Plan</DialogTitle>
          <DialogDescription>
            Set up a new installment payment plan for a customer.
          </DialogDescription>
        </DialogHeader>

        {showCustomerForm ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Add New Customer</h3>
            <CreateCustomerForm 
              onSuccess={handleCustomerCreated}
              onCancel={() => setShowCustomerForm(false)}
              businessId={currentBusiness?.id || ''}
            />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - KES {product.price.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <div className="space-y-2">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowCustomerForm(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Customer
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount (KES)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter total amount" 
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
                Create Plan
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}