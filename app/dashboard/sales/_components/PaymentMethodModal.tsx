import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, Wallet, Banknote } from "lucide-react"

interface PaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectMethod: (method: 'cash' | 'card' | 'mobile_money') => void
}

export const PaymentMethodModal = ({ isOpen, onClose, onSelectMethod }: PaymentMethodModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Payment Method</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="flex items-center justify-start gap-4 p-4 h-auto"
            onClick={() => onSelectMethod('cash')}
          >
            <Banknote className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Cash</div>
              <div className="text-sm text-muted-foreground">Pay with physical cash</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-start gap-4 p-4 h-auto"
            onClick={() => onSelectMethod('mobile_money')}
          >
            <Wallet className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Mobile Money</div>
              <div className="text-sm text-muted-foreground">Pay using mobile money service</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center justify-start gap-4 p-4 h-auto"
            onClick={() => onSelectMethod('card')}
          >
            <CreditCard className="h-5 w-5" />
            <div className="text-left">
              <div className="font-semibold">Card</div>
              <div className="text-sm text-muted-foreground">Pay with debit or credit card</div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}