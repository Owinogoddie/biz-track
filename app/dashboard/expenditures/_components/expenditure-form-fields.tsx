"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/formatters"
import { FundingSource, Expenditure } from "@prisma/client"
import { UseFormReturn } from "react-hook-form"
import * as z from "zod"

interface ExpenditureFormFieldsProps {
  form: UseFormReturn<any>
  fundingSources: FundingSource[]
  expenditures: Expenditure[]
  sales: number
  isSubmitting: boolean
  expenditure?: Expenditure
  onSubmit: (data: any) => Promise<void>
}

export function ExpenditureFormFields({ 
  form, 
  fundingSources, 
  expenditures,
  sales,
  isSubmitting,
  expenditure,
  onSubmit
}: ExpenditureFormFieldsProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="fundingSourceId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Funding Source</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select funding source" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="sales">
                  Sales Revenue ({formatCurrency(sales)})
                </SelectItem>
                {fundingSources.map(fs => (
                  <SelectItem key={fs.id} value={fs.id}>
                    {fs.name} ({formatCurrency(fs.amount)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
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
  )
}