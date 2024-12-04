"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useBusinessStore } from "@/store/useBusinessStore"
import { useExpenditureStore } from "@/store/useExpenditureStore"
import { createExpenditure, updateExpenditure } from "@/app/actions/expenditure"
import { Expenditure } from "@prisma/client"
import { useState } from "react"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
})

interface ExpenditureFormModalProps {
  expenditure?: Expenditure
  children: React.ReactNode
  availableBalance: number
}

export function ExpenditureFormModal({ expenditure, children, availableBalance }: ExpenditureFormModalProps) {
  const { toast } = useToast()
  const currentBusiness = useBusinessStore((state) => state.currentBusiness)
  const { addExpenditure, updateExpenditure: updateExpenditureInStore } = useExpenditureStore()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: expenditure?.amount.toString() || "",
      category: expenditure?.category || "",
      description: expenditure?.description || "",
      date: expenditure?.date ? new Date(expenditure.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!currentBusiness) return
    
    const amount = parseFloat(data.amount)
    
    // Check if new expenditure amount exceeds available balance
    if (!expenditure && amount > availableBalance) {
      toast({
        title: "Insufficient funds",
        description: `Cannot create expenditure. Amount exceeds available balance of KSH ${availableBalance.toLocaleString()}`,
        variant: "destructive",
      })
      return
    }
    
    // For updates, check if the difference exceeds available balance
    if (expenditure && (amount - expenditure.amount) > availableBalance) {
      toast({
        title: "Insufficient funds",
        description: `Cannot update expenditure. New amount exceeds available balance of KSH ${availableBalance.toLocaleString()}`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const expenditureData = {
      amount: amount,
      category: data.category,
      description: data.description,
      date: new Date(data.date),
      businessId: currentBusiness.id,
    }

    try {
      if (expenditure) {
        const result = await updateExpenditure(expenditure.id, expenditureData)
        if (result.success) {
          updateExpenditureInStore(result.expenditure)
          toast({
            title: "Expenditure updated!",
            description: "Expenditure has been updated successfully.",
          })
          setOpen(false)
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        }
      } else {
        const result = await createExpenditure(expenditureData)
        if (result.success) {
          addExpenditure(result.expenditure)
          toast({
            title: "Expenditure created!",
            description: "Expenditure has been created successfully.",
          })
          setOpen(false)
        } else {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expenditure ? "Edit Expenditure" : "Add Expenditure"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (KSH)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {expenditure ? "Update Expenditure" : "Add Expenditure"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}