"use client"

import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CldUploadWidget } from 'next-cloudinary'
import { updateBusiness } from '@/app/actions/settings'

export const businessFormSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  domain: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal('')),
  website: z.string().url().optional().nullable().or(z.literal('')),
  primaryColor: z.string().optional().nullable(),
  secondaryColor: z.string().optional().nullable(),
})

type BusinessFormValues = z.infer<typeof businessFormSchema>

interface BusinessFormProps {
  businessId: string
  initialData?: any
}

export function BusinessForm({ businessId, initialData }: BusinessFormProps) {
  const [img, setImg] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      domain: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
    }
  })

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      // Update all form fields with initialData
      Object.keys(initialData).forEach((key) => {
        if (key in form.getValues()) {
          form.setValue(key as keyof BusinessFormValues, initialData[key] || '')
        }
      })
      
      // Set image if logo exists
      if (initialData.logo) {
        setImg(initialData.logo)
      }
    }
  }, [initialData, form])

  async function onSubmit(data: BusinessFormValues) {
    try {
      setIsSubmitting(true)
      const formData = {
        ...data,
        logo: img?.secure_url || img || data.logo,
      }
      
      const result = await updateBusiness(businessId, formData)
      
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        })
        
        if (result.business) {
          Object.keys(result.business).forEach((key) => {
            if (key in form.getValues()) {
              form.setValue(key as keyof BusinessFormValues, result.business[key] || '')
            }
          })
        }
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Logo</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={img?.secure_url || img || ''} 
                      alt="Business Logo" 
                    />
                    <AvatarFallback>
                      {form.watch('name')?.charAt(0)?.toUpperCase() || 'B'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                    onSuccess={(result: any, { widget }: any) => {
                      setImg(result.info)
                      field.onChange(result.info.secure_url)
                      widget.close()
                    }}
                  >
                    {({ open }) => (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => open()}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Uploading...' : 'Upload Logo'}
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>
              </FormControl>
              <FormDescription>
                Upload a logo for your business
              </FormDescription>
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
                <Input placeholder="Your Business Name" {...field} />
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
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="business@email.com" 
                    type="email" 
                    {...field}
                    value={field.value || ''}
                  />
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="+1234567890" 
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://your-website.com" 
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your-domain.com" 
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Business Address"
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Color</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      {...field}
                      value={field.value || '#000000'}
                    />
                    <Input 
                      type="text" 
                      {...field}
                      value={field.value || '#000000'}
                    />
                  </div>
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
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      {...field}
                      value={field.value || '#ffffff'}
                    />
                    <Input 
                      type="text" 
                      {...field}
                      value={field.value || '#ffffff'}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Business Settings'}
        </Button>
      </form>
    </Form>
  )
}