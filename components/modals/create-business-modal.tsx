'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useBusinessStore } from '@/store/useBusinessStore'
import { createBusiness } from '@/app/actions/business'
import { Building2, Briefcase, Wrench, CreditCard, Package, Loader2 } from 'lucide-react'
import { useState } from 'react'

const businessTypes = [
  { 
    id: 'PRODUCT', 
    label: 'Product Business', 
    icon: Package, 
    description: 'For retail, wholesale, manufacturing businesses' 
  },
  { 
    id: 'SERVICE', 
    label: 'Service Provider', 
    icon: Wrench, 
    description: 'For service providers like consultants, salons' 
  },
  { 
    id: 'SUBSCRIPTION', 
    label: 'Subscription Business', 
    icon: CreditCard, 
    description: 'For gyms, membership clubs, recurring services' 
  },
  { 
    id: 'DISTRIBUTION', 
    label: 'Distribution Business', 
    icon: Building2, 
    description: 'For distributors to schools, hotels etc' 
  },
  { 
    id: 'HYBRID', 
    label: 'Hybrid Business', 
    icon: Briefcase, 
    description: 'For businesses that combine multiple types' 
  },
] as const;

const businessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  type: z.enum(['PRODUCT', 'SERVICE', 'SUBSCRIPTION', 'DISTRIBUTION', 'HYBRID']),
  description: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  address: z.string().optional(),
  openingBalance: z.number().default(0),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

type BusinessFormValues = z.infer<typeof businessSchema>

interface CreateBusinessModalProps {
  userId: string
  onClose?: () => void
}

export function CreateBusinessModal({ userId, onClose }: CreateBusinessModalProps) {
  const { toast } = useToast()
  const { setHasBusiness, setBusinesses, businesses, setCurrentBusiness } = useBusinessStore()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      type: 'PRODUCT',
      description: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      openingBalance: 0,
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
    },
  });

  async function onSubmit(data: BusinessFormValues) {
    setIsSubmitting(true);
    try {
      const result = await createBusiness({
        name: data.name, // Ensure name is always included
        type: data.type,
        description: data.description,
        email: data.email || undefined,
        phone: data.phone,
        website: data.website || undefined,
        address: data.address,
        openingBalance: data.openingBalance,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
      });
      
      if (result.success) {
        setHasBusiness(true);
        const newBusinesses = [...businesses, result.business];
        setBusinesses(newBusinesses);
        setCurrentBusiness(result.business);
        toast({
          title: 'Business created!',
          description: 'Your business has been created successfully.',
        });
        onClose?.();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create business',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedType = form.watch('type');
  const selectedTypeInfo = businessTypes.find(type => type.id === selectedType);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create your business</DialogTitle>
          <DialogDescription>
            Please provide your business details to get started.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Type</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {businessTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <div
                            key={type.id}
                            className={`cursor-pointer p-4 rounded-lg border transition-all ${
                              field.value === type.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => field.onChange(type.id)}
                          >
                            <Icon className="h-6 w-6 mb-2" />
                            <h3 className="font-medium text-sm">{type.label}</h3>
                          </div>
                        );
                      })}
                    </div>
                    {selectedTypeInfo && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedTypeInfo.description}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter business name" {...field} />
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
                      <Textarea 
                        placeholder="Describe your business" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="business@example.com" {...field} />
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
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
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
                      <Input placeholder="Business address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="secondaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="openingBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opening Balance</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00" 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Business
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}