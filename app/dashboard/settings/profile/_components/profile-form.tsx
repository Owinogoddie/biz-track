"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState, useEffect } from 'react'
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
import { toast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CldUploadWidget } from 'next-cloudinary'
import { useUser } from '@/hooks/useUser'
import { updateProfile } from '@/app/actions/profile'

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email(),
  picture: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { user, isLoading, mutate } = useUser()
  const [img, setImg] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      picture: user?.picture || '',
    },
  })

  // Update form when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        picture: user.picture || '',
      })
      if (user.picture) {
        setImg(user.picture)
      }
    }
  }, [user, form])

  async function onSubmit(data: ProfileFormValues) {
    try {
      setIsSaving(true)
      const formData = {
        ...data,
        picture: img?.secure_url || img || data.picture,
      }
      
      const result = await updateProfile(formData)
      
      if (result.success) {
        await mutate()
        
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully.',
        })
        
        if (result.user) {
          form.reset({
            name: result.user.name || '',
            email: result.user.email || '',
            picture: result.user.picture || '',
          })
          if (result.user.picture) {
            setImg(result.user.picture)
          }
        }
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update profile',
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
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="picture"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage 
                      src={img?.secure_url || img || ''} 
                      alt="Profile" 
                    />
                    <AvatarFallback>
                      {form.watch('name')?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
                    onSuccess={(result: any, { widget }: any) => {
                      setIsUploading(true)
                      setImg(result.info)
                      field.onChange(result.info.secure_url)
                      widget.close()
                      setIsUploading(false)
                    }}
                  >
                    {({ open }) => (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => open()}
                        disabled={isUploading || isSaving}
                      >
                        {isUploading ? 'Uploading...' : 'Upload Photo'}
                      </Button>
                    )}
                  </CldUploadWidget>
                </div>
              </FormControl>
              <FormDescription>
                Click to upload a new profile picture
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
                <Input placeholder="your@email.com" type="email" {...field} />
              </FormControl>
              <FormDescription>
                Your email address is used for notifications and login.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isUploading || isSaving}>
          {isSaving ? 'Saving...' : 'Update profile'}
        </Button>
      </form>
    </Form>
  )
}