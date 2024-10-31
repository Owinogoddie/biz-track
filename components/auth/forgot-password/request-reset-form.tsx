'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { simulateRequestPasswordReset } from '@/lib/auth-simulation'

const formSchema = z.object({
  email: z.string().email('Invalid email address')
})

interface RequestResetFormProps {
  onSuccess: (email: string) => void
}

export function RequestResetForm({ onSuccess }: RequestResetFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' }
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await simulateRequestPasswordReset(data.email)
      if (response.success) {
        onSuccess(data.email)
      } else {
        form.setError('root', { message: response.error })
      }
    } catch (error) {
        console.log(error)
      form.setError('root', { message: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          Send Reset Instructions
        </Button>
      </form>
    </Form>
  )
}