"use client"

import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { useBusinessStore } from "@/store/useBusinessStore"
import { useExpenditureStore } from "@/store/useExpenditureStore"
import { createExpenditure, updateExpenditure } from "@/app/actions/expenditure"
import { getFundingSources } from "@/app/actions/funding-source"
import { Expenditure, FundingSource } from "@prisma/client"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExpenditureFormFields } from "./expenditure-form-fields"
import { formatCurrency } from "@/lib/formatters"

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  fundingSourceId: z.string().min(1, "Funding source is required"),
})

interface ExpenditureFormModalProps {
  expenditure?: Expenditure
  children: React.ReactNode
  availableBalance: number
  sales: number
}
export function ExpenditureFormModal({ expenditure, children, availableBalance, sales }: ExpenditureFormModalProps) {
    const { toast } = useToast()
    const currentBusiness = useBusinessStore((state) => state.currentBusiness)
    const { addExpenditure, updateExpenditure: updateExpenditureInStore, expenditures } = useExpenditureStore()
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fundingSources, setFundingSources] = useState<FundingSource[]>([])
  
    const loadFundingSources = async () => {
      if (!currentBusiness) return
      const result = await getFundingSources(currentBusiness.id)
      if (result.success) {
        console.log('Fetched funding sources:', result.fundingSources)
        setFundingSources(result.fundingSources)
      }
    }
  
    useEffect(() => {
      if (open) {
        loadFundingSources()
      }
    }, [currentBusiness, open])
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        amount: expenditure?.amount.toString() || "",
        category: expenditure?.category || "",
        description: expenditure?.description || "",
        date: expenditure?.date ? new Date(expenditure.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        fundingSourceId: expenditure?.fundingSourceId || "sales",
      },
    })
  
    const selectedFundingSourceId = form.watch("fundingSourceId")
    const selectedFundingSource = selectedFundingSourceId === "sales" 
      ? undefined 
      : fundingSources.find(fs => fs.id === selectedFundingSourceId)
    
    const fundingSourceBalance = selectedFundingSourceId === "sales"
      ? sales
      : selectedFundingSource?.amount || 0
  
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      if (!currentBusiness) return
      
      const amount = parseFloat(data.amount)
      const isSalesRevenue = data.fundingSourceId === "sales"
      
      if (amount > fundingSourceBalance) {
        toast({
          title: "Insufficient funds",
          description: `Cannot create expenditure. Amount exceeds available balance of ${formatCurrency(fundingSourceBalance)}`,
          variant: "destructive",
        })
        return
      }
  
      setIsSubmitting(true)
  
      try {
        const expenditureData = {
          amount: amount,
          category: data.category,
          description: data.description,
          date: new Date(data.date),
          businessId: currentBusiness.id,
          fundingSourceId: isSalesRevenue ? null : data.fundingSourceId,
        }
  
        if (expenditure) {
          const result = await updateExpenditure(expenditure.id, expenditureData)
          if (result.success) {
            updateExpenditureInStore(result.expenditure)
            await loadFundingSources() // Refresh funding sources
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
            await loadFundingSources() // Refresh funding sources
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
            <ExpenditureFormFields 
              form={form}
              fundingSources={fundingSources}
              expenditures={expenditures}
              sales={sales}
              isSubmitting={isSubmitting}
              expenditure={expenditure}
              onSubmit={onSubmit}
            />
          </Form>
        </DialogContent>
      </Dialog>
    )
  }