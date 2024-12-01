interface Product {
    id: string
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    businessId: string
    quantity: number
    price: number
    sku: string | null
    barcode: string | null
    cost: number
    minQuantity: number
    categoryId: string
    unit: string
  }export interface Sale {
    id: string
    total: number
    createdAt: Date
    sellerId: string
    seller: {
      name: string
      email: string
    }
    items: SaleItem[]
  }
  
  export interface SaleItem {
    id: string
    quantity: number
    price: number
    product: Product
  }
  
  export interface SellerStats {
    name: string
    total: number
    count: number
  }
  
  export interface DateRangeType {
    from: Date
    to: Date | undefined
  }