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
import { useDeliveryRouteStore } from '@/store/useDeliveryRouteStore'
import { updateRoute } from '@/app/actions/deliveryRoute'
import { DeliveryRoute } from '@prisma/client'
import { Loader2 } from "lucide-react"
import { MultiSelect } from './multi-select'
import { useQuery } from '@tanstack/react-query'
import { useBusinessStore } from '@/store/useBusinessStore'

const routeSchema = z.object({
  name: z.string().min(2, 'Route name must be at least 2 characters'),
  description: z.string().optional(),
  clientIds: z.array(z.string()).optional(),
})

type RouteFormValues = z.infer<typeof routeSchema>

interface EditRouteModalProps {
  route: DeliveryRoute & { clients?: any[] }
  onClose?: () => void
}

export function EditRouteModal({ route, onClose }: EditRouteModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { currentBusiness } = useBusinessStore()
  const { updateRoute: updateRouteStore } = useDeliveryRouteStore()

  const { data: clients } = useQuery({
    queryKey: ['clients', currentBusiness?.id],
    queryFn: async () => {
      const response = await fetch(`/api/clients?businessId=${currentBusiness?.id}`)
      if (!response.ok) throw new Error('Failed to fetch clients')
      return response.json()
    },
    enabled: !!currentBusiness?.id
  })

  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      name: route.name,
      description: route.description || '',
      clientIds: route.clients?.map(client => client.id) || [],
    },
  })

  async function onSubmit(data: RouteFormValues) {
    setIsLoading(true)
    const result = await updateRoute(route.id, {
      ...data,
      businessId: route.businessId,
    })
    
    if (result.success) {
      updateRouteStore(result.route)
      toast({
        title: 'Route updated!',
        description: 'Your route has been updated successfully.',
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

  const clientOptions = clients?.map((client: any) => ({
    label: client.name,
    value: client.id,
  })) || []

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit route</DialogTitle>
          <DialogDescription>
            Make changes to your route here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter route name" {...field} />
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
                    <Textarea placeholder="Describe this route" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Clients</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={clientOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select clients"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Route
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}