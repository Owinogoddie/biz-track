import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Category } from '@/types/product'
import { CartSheet } from './CartSheet'
import { CartItem } from '@/types/product'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string | null
  onCategoryChange: (value: string | null) => void
  categories: Category[]
  cart: CartItem[]
  isProcessing: boolean
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveFromCart: (productId: string) => void
  onCompleteSale: () => Promise<void>
  getTotal: () => number
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  cart,
  isProcessing,
  onUpdateQuantity,
  onRemoveFromCart,
  onCompleteSale,
  getTotal
}: SearchBarProps) => {
  const handleCompleteSale = async () => {
    await onCompleteSale()
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
      <div className="w-full sm:flex-1 sm:max-w-md">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-[200px]">
        <Select 
          value={selectedCategory || undefined} 
          onValueChange={(value) => onCategoryChange(value || null)}
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
        onUpdateQuantity={onUpdateQuantity}
        onRemoveFromCart={onRemoveFromCart}
        onCompleteSale={handleCompleteSale}
        getTotal={getTotal}
      />
    </div>
  )
}