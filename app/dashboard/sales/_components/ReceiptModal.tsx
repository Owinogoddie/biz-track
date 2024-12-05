import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Printer, X } from "lucide-react"
import { CartItem } from "@/types/product"
import { formatCurrency } from "@/lib/formatters"
import { useBusinessStore } from "@/store/useBusinessStore"
import { useUser } from "@/hooks/useUser"
import jsPDF from "jspdf"
import { generateReceiptHeader, DEFAULT_BUSINESS } from "./receipt/ReceiptHeader"
import { generateReceiptItems } from "./receipt/ReceiptItems"
import { generateReceiptFooter } from "./receipt/ReceiptFooter"
import { Business } from "@/types/business"

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  saleData: {
    items: CartItem[]
    total: number
    paymentMethod: string
    date: Date
    receiptNumber: string
  }
}

type PdfFormat = 'a4' | 'letter' | 'thermal-80' | 'thermal-58'
type PdfConfig = {
  [key in PdfFormat]: {
    unit: "mm" | "pt" | "px" | "in" | "cm"
    format: string | number[]
  }
}

export const ReceiptModal = ({ isOpen, onClose, saleData }: ReceiptModalProps) => {
    const { currentBusiness } = useBusinessStore()
    const { user } = useUser()
    
    const business = currentBusiness || DEFAULT_BUSINESS
    const servedBy = user?.name || user?.email || 'Staff Member'
    
    const generateReceipt = async (format: PdfFormat) => {
      const receipt = document.getElementById('receipt-content')
      if (!receipt) return
      
      // Configure PDF based on format
      const pdfConfig: PdfConfig = {
        'a4': { unit: "mm", format: 'a4' },
        'letter': { unit: "mm", format: 'letter' },
        'thermal-80': { unit: "mm", format: [80, 297] },
        'thermal-58': { unit: "mm", format: [58, 297] }
      }
      
      const pdf = new jsPDF({
        unit: pdfConfig[format].unit,
        format: pdfConfig[format].format
      })
      
      // Adjust font size and margins based on format
      const config = {
        'a4': { fontSize: 10, headerSize: 16, margin: 20, rightAlign: 180 },
        'letter': { fontSize: 10, headerSize: 16, margin: 20, rightAlign: 180 },
        'thermal-80': { fontSize: 8, headerSize: 12, margin: 5, rightAlign: 75 },
        'thermal-58': { fontSize: 7, headerSize: 10, margin: 4, rightAlign: 54 }
      }
      
      let yPos = 20 // Starting position
      
      // Generate receipt header
      yPos = await generateReceiptHeader({
        business,
        pdf,
        yPos,
        format,
        config: config[format]
      })
      
      // Receipt details
      yPos += 10
      pdf.setTextColor(0, 0, 0)
      pdf.setFontSize(config[format].fontSize)
      pdf.text(`Receipt Number: ${saleData.receiptNumber}`, config[format].margin, yPos)
      yPos += 5
      pdf.text(`Date: ${saleData.date.toLocaleString()}`, config[format].margin, yPos)
      yPos += 5
      pdf.text(`Payment Method: ${saleData.paymentMethod}`, config[format].margin, yPos)
      yPos += 10
      
      // Generate items section
      yPos = generateReceiptItems({
        items: saleData.items,
        pdf,
        yPos,
        format,
        config: config[format]
      })
      
      // Generate footer
      generateReceiptFooter({
        total: saleData.total,
        businessName: business.name,
        servedBy,
        pdf,
        yPos,
        format,
        config: config[format]
      })
      
      return pdf
    }
  
    const handleDownload = async () => {
      const pdf = await generateReceipt('a4')
      if (pdf) {
        pdf.save(`receipt-${saleData.receiptNumber}.pdf`)
      }
    }
  
    const handlePrint = async () => {
      const pdf = await generateReceipt('thermal-58')
      if (pdf) {
        pdf.autoPrint()
        pdf.output('dataurlnewwindow')
      }
    }
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt Options</DialogTitle>
          </DialogHeader>
          
          <div id="receipt-content" className="hidden">
            {/* This div contains the receipt content for PDF generation */}
            <h2>Receipt</h2>
            <p>Receipt Number: {saleData.receiptNumber}</p>
            <p>Date: {saleData.date.toLocaleString()}</p>
            <p>Payment Method: {saleData.paymentMethod}</p>
            {saleData.items.map((item) => (
              <div key={item.product.id}>
                <span>{item.product.name} x{item.quantity}</span>
                <span>{formatCurrency(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <p>Total: {formatCurrency(saleData.total)}</p>
          </div>
          
          <div className="grid gap-4 py-4">
            <Button
              variant="outline"
              className="flex items-center justify-start gap-4 p-4 h-auto"
              onClick={handleDownload}
            >
              <Download className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Download Receipt</div>
                <div className="text-sm text-muted-foreground">Save as PDF file</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center justify-start gap-4 p-4 h-auto"
              onClick={handlePrint}
            >
              <Printer className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Print Receipt</div>
                <div className="text-sm text-muted-foreground">Send to printer</div>
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="flex items-center justify-start gap-4 p-4 h-auto"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Close</div>
                <div className="text-sm text-muted-foreground">Don't print or download</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
}