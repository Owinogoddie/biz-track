'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useSaleStore } from '@/store/useSaleStore'
import { createSale } from '@/app/actions/sale'
import { getProducts } from '@/app/actions/product'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { Button } from '@/components/ui/button'
import { ProductCard } from './_components/ProductCard'
import { CartSheet } from './_components/CartSheet'
import { Category, ProductWithCategory } from '@/types/product'
import { formatCurrency } from '@/lib/formatters'

const ITEMS_PER_PAGE = 12

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const { currentBusiness } = useBusinessStore()
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal } = useSaleStore()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch products and categories from server
  useEffect(() => {
    const fetchData = async () => {
      if (currentBusiness) {
        const result = await getProducts(currentBusiness.id)
        if (result.success) {
          setProducts(result.products)
          setFilteredProducts(result.products)
          
          // Fix duplicate categories by using category ID as the unique identifier
          const uniqueCategories = Array.from(
            new Map(
              result.products
                .filter(product => product.category) // Filter out products without categories
                .map(product => [product.category?.id, product.category]) // Use category ID as key
            ).values()
          ) as Category[]
          
          setCategories(uniqueCategories)
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
    
    fetchData()
  }, [currentBusiness, toast])

  // Filter products based on search term and category
  useEffect(() => {
    let filtered = products
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.categoryId === selectedCategory)
    }
    
    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, selectedCategory, products])

  const handleAddToCart = (product: ProductWithCategory) => {
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

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
      const productsResult = await getProducts(currentBusiness.id)
      if (productsResult.success) {
        setProducts(productsResult.products)
        setFilteredProducts(productsResult.products)
      }
      
      toast({
        title: 'Sale completed!',
        description: `Total: ${formatCurrency(getTotal())}`,
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

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)

  if (isLoading) {
    return (
      <div className="h-full md:h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full md:h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
        <div className="w-full sm:flex-1 sm:max-w-md">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select 
            value={selectedCategory || undefined} 
            onValueChange={(value) => setSelectedCategory(value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <CartSheet
          cart={cart}
          isProcessing={isProcessing}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onCompleteSale={handleCompleteSale}
          getTotal={getTotal}
        />
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default Sales