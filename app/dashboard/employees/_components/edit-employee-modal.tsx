"use client"
import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useEmployeeStore } from '@/store/useEmployeeStore'
import { updateBusinessUser } from '@/app/actions/employee'
import { BusinessRole, BusinessUser } from '@prisma/client'
import { Loader2 } from "lucide-react"

const employeeSchema = z.object({
  role: z.nativeEnum(BusinessRole),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>

interface EditEmployeeModalProps {
  employee: BusinessUser
  onClose?: () => void
}

export function EditEmployeeModal({ employee, onClose }: EditEmployeeModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { updateEmployee } = useEmployeeStore()

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      role: employee.role,
    },
  })

  async function onSubmit(data: EmployeeFormValues) {
    setIsLoading(true)
    const result = await updateBusinessUser(employee.id, {
      role: data.role,
      businessId: employee.businessId,
    })
    
    if (result.success) {
      updateEmployee(result.employee)
      toast({
        title: 'Employee updated!',
        description: 'Employee role has been updated successfully.',
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

  // Don't allow editing if employee is an owner
  if (employee.role === BusinessRole.OWNER) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cannot Edit Owner</DialogTitle>
            <DialogDescription>
              Owner roles cannot be modified.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose}>Close</Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit employee</DialogTitle>
          <DialogDescription>
            Change the role of this employee.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={BusinessRole.STAFF}>Staff</SelectItem>
                      <SelectItem value={BusinessRole.MANAGER}>Manager</SelectItem>
                      <SelectItem value={BusinessRole.ADMIN}>Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Role
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}