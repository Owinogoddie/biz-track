"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createPurchaseOrder } from "@/app/actions/purchaseOrder"
import { getSuppliers } from "@/app/actions/supplier"
import { useBusinessStore } from "@/store/useBusinessStore"
import { usePurchaseOrderStore } from "@/store/usePurchaseOrderStore"
import { Loader2 } from "lucide-react"

interface CreatePOModalProps {
  onClose: () => void
}

interface Supplier {
  id: string
  name: string
}

export function CreatePOModal({ onClose }: CreatePOModalProps) {
  const { toast } = useToast()
  const { currentBusiness } = useBusinessStore()
  const { addPurchaseOrder } = usePurchaseOrderStore()
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("")

  useEffect(() => {
    const fetchSuppliers = async () => {
      if (currentBusiness) {
        const result = await getSuppliers(currentBusiness.id)
        if (result.success) {
          setSuppliers(result.suppliers)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch suppliers",
            variant: "destructive",
          })
        }
      }
    }

    fetchSuppliers()
  }, [currentBusiness, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!currentBusiness) {
      toast({
        title: "Error",
        description: "No business selected",
        variant: "destructive",
      })
      return
    }

    if (!selectedSupplierId) {
      toast({
        title: "Error",
        description: "Please select a supplier",
        variant: "destructive",
      })
      return
    }

    // Validate items
    if (items.some(item => !item.description || item.quantity < 1 || item.unitPrice < 0)) {
      toast({
        title: "Error",
        description: "Please fill in all item details correctly",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const poNumber = formData.get('poNumber') as string
      const issueDate = new Date(formData.get('issueDate') as string)
      const deliveryDate = formData.get('deliveryDate') ? new Date(formData.get('deliveryDate') as string) : undefined
      const notes = formData.get('notes') as string

      // Convert prices to integers (cents)
      const formattedItems = items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: Math.round(item.unitPrice * 100) // Convert to cents
      }))

      const result = await createPurchaseOrder({
        poNumber,
        supplierId: selectedSupplierId,
        businessId: currentBusiness.id,
        issueDate,
        deliveryDate,
        notes,
        items: formattedItems
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Purchase order created successfully",
        })
        addPurchaseOrder(result.purchaseOrder)
        onClose()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create purchase order",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }])
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="supplier">Supplier</label>
              <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="poNumber">PO Number</label>
              <Input id="poNumber" name="poNumber" required placeholder="PO-2024-001" />
            </div>
            <div className="space-y-2">
              <label htmlFor="issueDate">Issue Date</label>
              <Input id="issueDate" name="issueDate" type="date" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="deliveryDate">Delivery Date</label>
              <Input id="deliveryDate" name="deliveryDate" type="date" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Items</h3>
              <Button type="button" variant="outline" onClick={addItem}>Add Item</Button>
            </div>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  required
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                  required
                  min="1"
                />
                <Input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label htmlFor="notes">Notes</label>
            <Textarea id="notes" name="notes" placeholder="Additional notes..." />
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Purchase Order'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}