// "use client"

// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { useToast } from "@/hooks/use-toast"
// import { useBusinessStore } from "@/store/useBusinessStore"
// import { useResourceStore } from "@/store/useResourceStore"
// import { createExpenditure, updateExpenditure } from "@/app/actions/expenditure"
// import { TransactionSource } from "@prisma/client"
// import { useState } from "react"
// import { Loader2 } from "lucide-react"
// import { formatCurrency } from "@/lib/formatters"
// import { Expenditure } from "@prisma/client"

// const formSchema = z.object({
//   amount: z.string().min(1, "Amount is required"),
//   category: z.string().min(1, "Category is required"),
//   description: z.string().min(1, "Description is required"),
//   date: z.string().min(1, "Date is required"),
//   source: z.string().min(1, "Source is required"),
// })

// const sourceLabels: Record<TransactionSource, string> = {
//   BUSINESS_OPERATIONS: "Business Operations",
//   LOAN: "Loans",
//   GIFT: "Gifts",
//   INVESTMENT: "Investments",
//   PERSONAL_FUNDS: "Personal Funds",
//   OTHER: "Other Sources"
// }

// export interface ExpenditureFormProps {
//   defaultValues?: Expenditure
//   onSuccess?: () => void
//   onCancel?: () => void
// }

// export function ExpenditureForm({ defaultValues, onSuccess, onCancel }: ExpenditureFormProps) {
//   const { toast } = useToast()
//   const { balances } = useResourceStore()
//   const currentBusiness = useBusinessStore((state) => state.currentBusiness)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       amount: defaultValues?.amount.toString() || "",
//       category: defaultValues?.category || "",
//       description: defaultValues?.description || "",
//       date: defaultValues?.date ? new Date(defaultValues.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//       source: defaultValues?.source || "BUSINESS_OPERATIONS",
//     },
//   })

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     if (!currentBusiness) return

//     const amount = parseFloat(data.amount)
//     const source = data.source as TransactionSource
    
//     // Find the balance for the selected source
//     const sourceBalance = balances.find(b => b.source === source)
//     if (!sourceBalance || sourceBalance.available < amount) {
//       toast({
//         title: "Insufficient funds",
//         description: `Cannot create expenditure. Amount exceeds available balance of ${formatCurrency(sourceBalance?.available || 0)}`,
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       const expenditureData = {
//         amount,
//         category: data.category,
//         description: data.description,
//         date: new Date(data.date),
//         businessId: currentBusiness.id,
//         source,
//       }

//       if (defaultValues) {
//         const result = await updateExpenditure(defaultValues.id, expenditureData)
//         if (result.success) {
//           toast({
//             title: "Expenditure updated!",
//             description: "Expenditure has been updated successfully.",
//           })
//           onSuccess?.()
//         } else {
//           toast({
//             title: "Error",
//             description: result.error,
//             variant: "destructive",
//           })
//         }
//       } else {
//         const result = await createExpenditure(expenditureData)
//         if (result.success) {
//           toast({
//             title: "Expenditure created!",
//             description: "Expenditure has been created successfully.",
//           })
//           onSuccess?.()
//         } else {
//           toast({
//             title: "Error",
//             description: result.error,
//             variant: "destructive",
//           })
//         }
//       }
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <FormField
//           control={form.control}
//           name="source"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Source</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select source" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {balances
//                     .filter(balance => balance.available > 0)
//                     .map(balance => (
//                       <SelectItem key={balance.source} value={balance.source}>
//                         {sourceLabels[balance.source]} ({formatCurrency(balance.available)} available)
//                       </SelectItem>
//                     ))}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="amount"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Amount (KES)</FormLabel>
//               <FormControl>
//                 <Input type="number" step="0.01" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="category"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Category</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Textarea {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="date"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Date</FormLabel>
//               <FormControl>
//                 <Input type="date" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <div className="flex justify-end gap-2">
//           {onCancel && (
//             <Button type="button" variant="outline" onClick={onCancel}>
//               Cancel
//             </Button>
//           )}
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//             {defaultValues ? "Update Expenditure" : "Add Expenditure"}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   )
// }