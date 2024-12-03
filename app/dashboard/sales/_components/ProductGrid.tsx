import { ProductWithCategory } from '@/types/product'
import { ProductCard } from './ProductCard'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ProductGridProps {
  products: ProductWithCategory[]
  onAddToCart: (product: ProductWithCategory) => void
}

export const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </ScrollArea>
  )
}