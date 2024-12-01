import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@prisma/client'

interface CartItem {
  product: Product
  quantity: number
}

interface SaleStore {
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useSaleStore = create<SaleStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product, quantity = 1) => set((state) => {
        const existingItem = state.cart.find(item => item.product.id === product.id)
        
        if (existingItem) {
          return {
            cart: state.cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }
        }
        
        return {
          cart: [...state.cart, { product, quantity }]
        }
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.product.id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      })),
      clearCart: () => set({ cart: [] }),
      getTotal: () => {
        const state = get()
        return state.cart.reduce((total, item) => 
          total + (item.product.price * item.quantity), 0
        )
      }
    }),
    {
      name: 'cart-storage', // unique name for localStorage key
    }
  )
)