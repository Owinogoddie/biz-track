import { CartItem } from '@/types/product'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { useState } from 'react'
import { PaymentMethodModal } from './PaymentMethodModal'
import { ReceiptModal } from './ReceiptModal'
import confetti from 'canvas-confetti'

interface CartSheetProps {
  cart: CartItem[]
  isProcessing: boolean
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveFromCart: (productId: string) => void
  onCompleteSale: () => Promise<void>
  getTotal: () => number
}

export const CartSheet = ({
  cart,
  isProcessing,
  onUpdateQuantity,
  onRemoveFromCart,
  onCompleteSale,
  getTotal
}: CartSheetProps) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [receiptData, setReceiptData] = useState<any>(null)

  const handlePaymentMethodSelect = async (method: 'cash' | 'card' | 'mobile_money') => {
    setSelectedPaymentMethod(method)
    setShowPaymentModal(false)
    
    // Process the sale
    await onCompleteSale()
    
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    // Prepare receipt data
    setReceiptData({
      items: cart,
      total: getTotal(),
      paymentMethod: method,
      date: new Date(),
      receiptNumber: `REC${Date.now().toString().slice(-6)}`
    })
    
    // Show receipt modal
    setShowReceiptModal(true)
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full sm:w-auto">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Cart ({cart.length})
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-12rem)] mt-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.product.price)} each
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveFromCart(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Total:</span>
              <span className="font-medium">{formatCurrency(getTotal())}</span>
            </div>
            <Button 
              className="w-full" 
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0 || isProcessing}
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Sale
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelectMethod={handlePaymentMethodSelect}
      />

      {receiptData && (
        <ReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          saleData={receiptData}
        />
      )}
    </>
  )
}