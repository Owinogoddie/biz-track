import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ClientType } from '@prisma/client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useDistributionClientStore } from '@/store/useDistributionClientStore'
import { createDistributionClient, CreateDistributionClientInput } from '@/app/actions/distributionClient'
import { Loader2 } from "lucide-react"

const clientSchema = z.object({
  name: z.string().min(2, 'Client name must be at least 2 characters'),
  type: z.nativeEnum(ClientType),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
})

type ClientFormValues = z.infer<typeof clientSchema>

interface CreateClientModalProps {
  onClose?: () => void
}

export function CreateClientModal({ onClose }: CreateClientModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { currentBusiness } = useBusinessStore()
  const { addClient } = useDistributionClientStore()

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      type: ClientType.OTHER,
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
    },
  })

  async function onSubmit(data: ClientFormValues) {
    if (!currentBusiness) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No business selected',
      })
      return
    }
  
    // Ensure name is not empty
    if (!data.name.trim()) {
      form.setError('name', { message: 'Client name is required' })
      return
    }
  
    setIsLoading(true)
    const result = await createDistributionClient({
      ...data,
      businessId: currentBusiness.id,
      name: data.name  
    } as CreateDistributionClientInput)
    
    
    if (result.success) {
      addClient(result.client)
      toast({
        title: 'Client created!',
        description: 'Your client has been created successfully.',
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
          <DialogTitle>Create client</DialogTitle>
          <DialogDescription>
            Add a new distribution client to your business.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
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
                  <FormLabel>Client Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ClientType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ')}
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
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact person name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Client
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}