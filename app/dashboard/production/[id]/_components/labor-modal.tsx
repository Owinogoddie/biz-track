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
import { createLabor, updateLabor, type CreateLaborInput } from '@/app/actions/labor'
import { Loader2 } from "lucide-react"
import { Labor, PaymentPeriod, Worker } from '@prisma/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

const laborSchema = z.object({
  workerId: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  date: z.date(),
  hours: z.number().optional(),
  days: z.number().optional(),
  rate: z.number().min(0, 'Rate must be greater than 0'),
  periodType: z.string(),
  notes: z.string().optional(),
})

type LaborFormValues = z.infer<typeof laborSchema>

interface LaborModalProps {
  stageId: string
  workers: Worker[]
  labor?: Labor & { worker: Worker }
  onClose?: () => void
  onSuccess?: () => void
}

export function LaborModal({ stageId, workers, labor, onClose, onSuccess }: LaborModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showCasualWorkerFields, setShowCasualWorkerFields] = useState(false)
  const { toast } = useToast()

  const form = useForm<LaborFormValues>({
    resolver: zodResolver(laborSchema),
    defaultValues: {
      workerId: labor?.workerId || '',
      firstName: labor?.worker?.firstName || '',
      lastName: labor?.worker?.lastName || '',
      date: labor?.date || new Date(),
      hours: labor?.hours || undefined,
      days: labor?.days || undefined,
      rate: Number(labor?.rate) || 0,
      periodType: labor?.periodType || 'HOURLY',
      notes: labor?.notes || '',
    },
  })

  const periodType = form.watch('periodType')

  async function onSubmit(data: LaborFormValues) {
    setIsLoading(true)
    
    if (!showCasualWorkerFields && !data.workerId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Worker is required',
      })
      setIsLoading(false)
      return
    }

    if (showCasualWorkerFields && (!data.firstName || !data.lastName)) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'First name and last name are required for casual workers',
      })
      setIsLoading(false)
      return
    }
  
    const laborInput: CreateLaborInput = {
      workerId: showCasualWorkerFields ? undefined : data.workerId,
      firstName: showCasualWorkerFields ? data.firstName : undefined,
      lastName: showCasualWorkerFields ? data.lastName : undefined,
      stageId,
      date: data.date,
      hours: data.hours || null,
      days: data.days || null,
      rate: data.rate,
      periodType: data.periodType as PaymentPeriod,
      notes: data.notes || null
    }
  
    const result = labor 
      ? await updateLabor(labor.id, laborInput)
      : await createLabor(laborInput)
    
    if (result.success) {
      toast({
        title: `Labor entry ${labor ? 'updated' : 'created'}!`,
        description: `Labor entry has been ${labor ? 'updated' : 'created'} successfully.`,
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
    setIsLoading(false)
  }
  
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{labor ? 'Edit' : 'Add'} Labor Entry</DialogTitle>
          <DialogDescription>
            {labor ? 'Make changes to the' : 'Add a new'} labor entry.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                className={!showCasualWorkerFields ? "bg-primary text-primary-foreground" : ""}
                onClick={() => setShowCasualWorkerFields(false)}
              >
                Regular Worker
              </Button>
              <Button
                type="button"
                variant="outline"
                className={showCasualWorkerFields ? "bg-primary text-primary-foreground" : ""}
                onClick={() => setShowCasualWorkerFields(true)}
              >
                Casual Worker
              </Button>
            </div>

            {showCasualWorkerFields ? (
              <>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <FormField
                control={form.control}
                name="workerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select worker" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workers
                          .filter(w => !w.isCasual)
                          .map((worker) => (
                            <SelectItem key={worker.id} value={worker.id}>
                              {worker.firstName} {worker.lastName}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="periodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Period</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="HOURLY">Hourly</SelectItem>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {periodType === 'HOURLY' && (
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours Worked</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={0}
                        step="0.5"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {periodType === 'DAILY' && (
              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days Worked</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={0}
                        step="0.5"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate ({periodType.toLowerCase()})</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min={0}
                      step="0.01"
                      {...field}
                      value={field.value || ''}
                      onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {labor ? 'Update' : 'Add'} Labor Entry
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}