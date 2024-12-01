'use client'

import { useEffect, useState } from 'react'
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useSaleStore } from '@/store/useSaleStore'
import { createSale } from '@/app/actions/sale'
import { getProducts } from '@/app/actions/product'
import { Product } from '@prisma/client'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from '@/components/ui/separator'
import { Loader2 } from "lucide-react"

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { currentBusiness } = useBusinessStore()
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal } = useSaleStore()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch products from server
  useEffect(() => {
    const fetchProducts = async () => {
      if (currentBusiness) {
        const result = await getProducts(currentBusiness.id)
        if (result.success) {
          setProducts(result.products)
          setFilteredProducts(result.products)
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error
          })
        }
        setIsLoading(false)
      }
    }
    
    fetchProducts()
  }, [currentBusiness, toast])

  // Filter products based on search term
  useEffect(() => {
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, products])

  const handleCompleteSale = async () => {
    if (!currentBusiness || cart.length === 0) return

    setIsProcessing(true)
    const result = await createSale({
      businessId: currentBusiness.id,
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }))
    })

    if (result.success) {
      // Refresh products after sale
      const productsResult = await getProducts(currentBusiness.id)
      if (productsResult.success) {
        setProducts(productsResult.products)
        setFilteredProducts(productsResult.products)
      }
      
      toast({
        title: 'Sale completed!',
        description: `Total: $${getTotal().toFixed(2)}`,
      })
      clearCart()
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      })
    }
    setIsProcessing(false)
  }

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="ml-4">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart ({cart.length})
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Shopping Cart</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-12rem)] mt-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between py-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total:</span>
                <span className="font-medium">${getTotal().toFixed(2)}</span>
              </div>
              <Button 
                className="w-full" 
                onClick={handleCompleteSale}
                disabled={cart.length === 0 || isProcessing}
              >
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Sale
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => addToCart(product)}
            >
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Stock: {product.quantity}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold">${product.price.toFixed(2)}</span>
                <Button size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default Sales