export type MaterialQualityStatus = 'GOOD' | 'DEFECTIVE' | 'EXPIRED' | 'CONTAMINATED'

export interface Material {
  id: string
  name: string
  description?: string
  unit: string
  costPerUnit: number
  quantity: number
}

export interface MaterialUsage {
  id: string
  productionId: string
  materialId: string
  material: Material
  targetQuantity?: number
  actualQuantity: number
  unit: string
  costPerUnit: number
  totalCost: number
  usageDate: Date
  notes?: string
  qualityStatus: MaterialQualityStatus
  wasteQuantity?: number
  wasteReason?: string
}