import { Business } from "@/types/business"

interface ReceiptHeaderProps {
  business: Business
  pdf: any
  yPos: number
  format: 'a4' | 'letter' | 'thermal-80' | 'thermal-58'
  config: {
    fontSize: number
    headerSize: number
    margin: number
    rightAlign: number
  }
}

export const DEFAULT_BUSINESS: Business = {
  id: "default",
  name: "My Business",
  logo: "https://cdn.vectorstock.com/i/500p/15/12/gold-arrow-chart-business-finance-logo-vector-14921512.jpg",
  address: "123 Business Street",
  phone: "(555) 123-4567",
  email: "contact@mybusiness.com",
  website: "www.mybusiness.com",
  primaryColor: "#9b87f5",
  secondaryColor: "#7E69AB"
}

async function convertUrlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64 via proxy:", error);
    throw error;
  }
}

export const generateReceiptHeader = async ({
  business,
  pdf,
  yPos,
  format,
  config
}: ReceiptHeaderProps) => {
  const { fontSize, headerSize, margin, rightAlign } = config
  const pageWidth = pdf.internal.pageSize.width
  
  // Calculate centered logo dimensions and position - made smaller
  const logoSize = format.startsWith('thermal') ? 20 : 25 // Reduced from 25/35 to 20/25
  const centerX = format.startsWith('thermal') ? rightAlign / 2 : pageWidth / 2
  const logoX = centerX - (logoSize / 2)
  
  // Add logo with circular clipping - made fully rounded
  try {
    const logoUrl = business.logo || DEFAULT_BUSINESS.logo
    const logoBase64 = await convertUrlToBase64(logoUrl)
    
    // Create circular clipping with full radius
    pdf.setDrawColor(0)
    pdf.setFillColor(255, 255, 255)
    pdf.circle(centerX, yPos + (logoSize / 2), logoSize / 2, 'F')
    
    // Add the image
    pdf.addImage(logoBase64, "PNG", logoX, yPos, logoSize, logoSize)
  } catch (error) {
    console.error("Error adding logo:", error)
  }
  
  // Update yPos after logo with more spacing
  yPos += logoSize + 15
  
  // Convert hex colors to RGB
  const primaryColor = business.primaryColor ? [
    parseInt(business.primaryColor.slice(1,3), 16),
    parseInt(business.primaryColor.slice(3,5), 16),
    parseInt(business.primaryColor.slice(5,7), 16)
  ] : [0, 0, 0]
  
  const secondaryColor = business.secondaryColor ? [
    parseInt(business.secondaryColor.slice(1,3), 16),
    parseInt(business.secondaryColor.slice(3,5), 16),
    parseInt(business.secondaryColor.slice(5,7), 16)
  ] : [102, 102, 102]
  
  // Add business name (centered)
  pdf.setTextColor(...primaryColor)
  pdf.setFontSize(headerSize)
  pdf.text(business.name || DEFAULT_BUSINESS.name, centerX, yPos, { align: 'center' })
  
  // Increased spacing after business name
  yPos += 20
  
  // Business contact details (left-aligned with proper formatting)
  pdf.setTextColor(...secondaryColor)
  pdf.setFontSize(fontSize)
  
  // Format contact details with proper spacing and labels
  const contactDetails = [
    { text: business.address || DEFAULT_BUSINESS.address, spacing: 8 },
    { text: `Tel: ${business.phone || DEFAULT_BUSINESS.phone}`, spacing: 6 },
    { text: `Email: ${business.email || DEFAULT_BUSINESS.email}`, spacing: 6 },
    { text: `Web: ${business.website || DEFAULT_BUSINESS.website}`, spacing: 8 }
  ]
  
  // Left-align the contact details with proper margin
  contactDetails.forEach(({ text, spacing }) => {
    pdf.text(text, margin + 5, yPos)
    yPos += spacing
  })
  
  // Add divider with more spacing
  yPos += 8
  pdf.setDrawColor(...primaryColor)
  pdf.setLineWidth(0.5)
  pdf.line(margin, yPos, format.startsWith('thermal') ? rightAlign : pageWidth - margin, yPos)
  
  return yPos + 12
}