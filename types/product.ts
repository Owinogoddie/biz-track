export interface Category {
    id: string
    name: string
  }
  
  export interface ProductWithCategory {
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
    category: Category | null
    createdAt: Date
    updatedAt: Date
  }
  
  export interface CartItem {
    product: ProductWithCategory
    quantity: number
  }
  
  export interface SaleItem {
    productId: string
    quantity: number
    price: number
  }