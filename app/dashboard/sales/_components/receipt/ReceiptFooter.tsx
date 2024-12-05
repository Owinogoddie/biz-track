import { formatCurrency } from "@/lib/formatters"

interface ReceiptFooterProps {
  total: number
  businessName: string
  servedBy: string
  pdf: any
  yPos: number
  format: 'a4' | 'letter' | 'thermal-80' | 'thermal-58'
  config: {
    fontSize: number
    margin: number
    rightAlign: number
  }
}

export const generateReceiptFooter = ({
  total,
  businessName,
  servedBy,
  pdf,
  yPos,
  format,
  config
}: ReceiptFooterProps) => {
  const { fontSize, margin, rightAlign } = config
  
  // Total
  pdf.setFontSize(fontSize + 2)
  yPos += 5
  pdf.text(`Total: ${formatCurrency(total)}`, rightAlign, yPos, { align: 'right' })
  
  // Served by
  yPos += 10
  pdf.setFontSize(fontSize)
  pdf.text(`Served by: ${servedBy}`, margin, yPos)
  
  // Thank you message
  if (businessName) {
    yPos += 15
    pdf.setFontSize(fontSize)
    pdf.text('Thank you for choosing', format.startsWith('thermal') ? rightAlign / 2 : margin, yPos, {
      align: format.startsWith('thermal') ? 'center' : 'left'
    })
    yPos += 5
    pdf.text(businessName, format.startsWith('thermal') ? rightAlign / 2 : margin, yPos, {
      align: format.startsWith('thermal') ? 'center' : 'left'
    })
  }
  
  return yPos
}