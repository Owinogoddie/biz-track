import { create } from 'zustand'

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
interface ProductStore {
  products: ProductWithCategory[]
  setProducts: (products: ProductWithCategory[]) => void
  addProduct: (product: ProductWithCategory) => void
  updateProduct: (product: ProductWithCategory) => void
  removeProduct: (id: string) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}))