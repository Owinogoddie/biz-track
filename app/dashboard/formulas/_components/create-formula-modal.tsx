'use client'

import * as z from 'zod'
import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useFormulaStore } from '@/store/useFormulaStore'
import { useProductStore } from '@/store/useProductStore'
import { createFormula } from '@/app/actions/formula'
import { getProducts } from '@/app/actions/product'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Plus, Minus } from "lucide-react"


const formulaSchema = z.object({
  name: z.string().min(2, 'Formula name must be at least 2 characters'),
  description: z.string().optional(),
  productId: z.string().min(1, 'Product must be selected'),
})

type FormulaFormValues = z.infer<typeof formulaSchema>

interface CreateFormulaModalProps {
  onClose?: () => void
  onSuccess?: () => void
}

export function CreateFormulaModal({ onClose, onSuccess }: CreateFormulaModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { currentBusiness } = useBusinessStore()
  const { addFormula } = useFormulaStore()
  const { products, setProducts } = useProductStore()

  useEffect(() => {
    const fetchProducts = async () => {
      if (currentBusiness) {
        const result = await getProducts(currentBusiness.id)
        if (result.success) {
          setProducts(result.products)
        }
      }
    }
    
    fetchProducts()
  }, [currentBusiness, setProducts])

  const form = useForm<FormulaFormValues>({
    resolver: zodResolver(formulaSchema),
    defaultValues: {
      name: '',
      description: '',
      productId: '',
    },
  })

 

  async function onSubmit(data: FormulaFormValues) {
    if (!currentBusiness) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No business selected',
      })
      return
    }

    setIsLoading(true)
    const formulaInput = {
      name: data.name,
      description: data.description || '',
      businessId: currentBusiness.id,
      productId: data.productId,
    }
  
    const result = await createFormula(formulaInput)
    
    if (result.success) {
      addFormula(result.formula)
      toast({
        title: 'Success',
        description: 'Formula created successfully',
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Formula</DialogTitle>
          <DialogDescription>
            Add a new production formula with materials and quantities.
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
              Create Formula
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}