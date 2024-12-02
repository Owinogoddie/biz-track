import { ProductWithCategory } from '@/types/product'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'

interface ProductCardProps {
  product: ProductWithCategory
  onAddToCart: (product: ProductWithCategory) => void
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onAddToCart(product)}
    >
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-sm text-muted-foreground mb-2">
        Stock: {product.quantity}
      </p>
      {product.category && (
        <p className="text-sm text-muted-foreground">
          {product.category.name}
        </p>
      )}
      <div className="flex justify-between items-center">
        <span className="font-bold">{formatCurrency(product.price)}</span>
        <Button size="sm">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}