'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useSaleStore } from '@/store/useSaleStore'
import { createSale } from '@/app/actions/sale'
import { getProducts } from '@/app/actions/product'
import { Loader2 } from "lucide-react"
import { ProductWithCategory, Category } from '@/types/product'
import { formatCurrency } from '@/lib/formatters'
import { SearchBar } from './_components/SearchBar'
import { ProductGrid } from './_components/ProductGrid'
import { PaginationControls } from './_components/PaginationControls'

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

  useEffect(() => {
    const fetchData = async () => {
      if (currentBusiness) {
        const result = await getProducts(currentBusiness.id)
        if (result.success) {
          setProducts(result.products)
          setFilteredProducts(result.products)
          
          const uniqueCategories = Array.from(
            new Map(
              result.products
                .filter(product => product.category)
                .map(product => [product.category?.id, product.category])
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
    setCurrentPage(1)
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
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        cart={cart}
        isProcessing={isProcessing}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onCompleteSale={handleCompleteSale}
        getTotal={getTotal}
      />
      
      <ProductGrid
        products={paginatedProducts}
        onAddToCart={handleAddToCart}
      />
      
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

export default Sales