import { CartItem } from "@/types/product"
import { formatCurrency } from "@/lib/formatters"

interface ReceiptItemsProps {
  items: CartItem[]
  pdf: any
  yPos: number
  format: 'a4' | 'letter' | 'thermal-80' | 'thermal-58'
  config: {
    fontSize: number
    margin: number
    rightAlign: number
  }
}

export const generateReceiptItems = ({
  items,
  pdf,
  yPos,
  format,
  config
}: ReceiptItemsProps) => {
  const { fontSize, margin, rightAlign } = config
  
  pdf.setFontSize(fontSize)
  pdf.setTextColor('000000')
  
  items.forEach((item) => {
    const itemText = `${item.product.name} x${item.quantity}`
    const itemPrice = formatCurrency(item.product.price * item.quantity)
    
    if (format === 'thermal-58' && itemText.length > 20) {
      const truncatedText = itemText.slice(0, 17) + '...'
      pdf.text(truncatedText, margin, yPos)
    } else {
      pdf.text(itemText, margin, yPos)
    }
    
    pdf.text(itemPrice, rightAlign, yPos, { align: 'right' })
    yPos += 5
  })
  
  return yPos
}