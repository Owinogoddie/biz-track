'use client'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useProductStore } from '@/store/useProductStore'
import { getProducts } from '@/app/actions/product'
import { CreateProductModal } from './_components/create-product-modal'
import { columns } from './_components/columns'
export type ProductWithCategory = {
  id: string
  name: string
  sku: string | null
  barcode: string | null
  description: string | null
  price: number
  cost: number
  quantity: number
  minQuantity: number
  businessId: string
  categoryId: string
  category: {
    id: string
    name: string
  } | null
  createdAt: Date
  updatedAt: Date
}
const Products = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
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

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Add Product
    </Button>
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <p className="text-muted-foreground">
          Manage your products here
        </p>
      </div>
      
      <DataTable<ProductWithCategory, unknown>
        columns={columns} 
        data={products} 
        searchKey="name"
        toolbar={toolbar}
      />
      
      {showCreateModal && (
        <CreateProductModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Products