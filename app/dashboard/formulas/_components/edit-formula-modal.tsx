'use client'

import * as z from 'zod'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'
import { useFormulaStore } from '@/store/useFormulaStore'
import { useProductStore } from '@/store/useProductStore'
import { updateFormula } from '@/app/actions/formula'
import { getProducts } from '@/app/actions/product'
import { ProductionFormula } from '@prisma/client'
import { Loader2 } from "lucide-react"

const formulaSchema = z.object({
  name: z.string().min(2, 'Formula name must be at least 2 characters'),
  description: z.string().optional(),
  productId: z.string().min(1, 'Product must be selected'),
})

type FormulaFormValues = z.infer<typeof formulaSchema>

interface EditFormulaModalProps {
  formula: ProductionFormula
  onClose?: () => void
}

export function EditFormulaModal({ formula, onClose }: EditFormulaModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { updateFormula: updateFormulaStore } = useFormulaStore()
  const { products, setProducts } = useProductStore()

  useEffect(() => {
    const fetchProducts = async () => {
      if (formula.businessId) {
        const result = await getProducts(formula.businessId)
        if (result.success) {
          setProducts(result.products)
        }
      }
    }
    
    fetchProducts()
  }, [formula.businessId, setProducts])

  const form = useForm<FormulaFormValues>({
    resolver: zodResolver(formulaSchema),
    defaultValues: {
      name: formula.name,
      description: formula.description || '',
      productId: formula.productId || '',
    },
  })

  async function onSubmit(data: FormulaFormValues) {
    setIsLoading(true)
    const result = await updateFormula(formula.id, {
      ...data,
      businessId: formula.businessId,
    })
    
    if (result.success) {
      updateFormulaStore(result.formula)
      toast({
        title: 'Formula updated!',
        description: 'Your formula has been updated successfully.',
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Formula</DialogTitle>
          <DialogDescription>
            Make changes to your formula here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formula Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter formula name" {...field} />
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
                    <Textarea placeholder="Describe this formula" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Formula
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}