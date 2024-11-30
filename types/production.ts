
export enum MaterialQualityStatus {
  GOOD = 'GOOD',
  DAMAGED = 'DAMAGED',
  EXPIRED = 'EXPIRED',
  CONTAMINATED = 'CONTAMINATED',
  BELOW_STANDARD = 'BELOW_STANDARD'
}

export enum LaborTaskType {
  PREPARATION = 'PREPARATION',
  PROCESSING = 'PROCESSING',
  QUALITY_CHECK = 'QUALITY_CHECK',
  PACKAGING = 'PACKAGING',
  MAINTENANCE = 'MAINTENANCE',
  CLEANING = 'CLEANING',
  OTHER = 'OTHER'
}

export enum QualityCheckType {
  VISUAL_INSPECTION = 'VISUAL_INSPECTION',
  MEASUREMENT = 'MEASUREMENT',
  CHEMICAL_TEST = 'CHEMICAL_TEST',
  TASTE_TEST = 'TASTE_TEST',
  EQUIPMENT_CHECK = 'EQUIPMENT_CHECK',
  SAFETY_CHECK = 'SAFETY_CHECK'
}

export enum QualityStatus {
  PENDING = 'PENDING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  NEEDS_REVIEW = 'NEEDS_REVIEW'
}

export enum ProductionStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD'
}

export interface MaterialUsage {
  id: string
  productionId: string
  materialId: string
  material?: Product
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
  createdAt: Date
  updatedAt: Date
}

export interface LaborRecord {
  id: string
  productionId: string
  workerId: string
  workerName: string
  taskType: LaborTaskType
  startTime: Date
  endTime?: Date
  hoursWorked?: number
  hourlyRate: number
  totalCost: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface QualityCheck {
  id: string
  productionId: string
  checkType: QualityCheckType
  status: QualityStatus
  checkedBy: string
  checkedAt: Date
  parameters?: any
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface ProductionStep {
  id: string
  name: string
  description?: string
  status: ProductionStatus
  productionId: string
  orderIndex: number
  startDate?: Date
  endDate?: Date
  notes?: string
  result?: string
  createdAt: Date
  updatedAt: Date
}

export type Production = {
  id: string
  name: string
  description?: string | null
  status: ProductionStatus
  businessId: string
  formulaId: string
  targetQuantity?: number | null
  actualQuantity?: number | null
  estimatedCost?: number | null
  actualCost?: number | null
  startDate?: Date | null
  endDate?: Date | null
  formula?: ProductionFormula
  steps?: ProductionStep[]
  materialUsage?: MaterialUsage[]
  laborRecords?: LaborRecord[]
  qualityChecks?: QualityCheck[]
  createdAt: Date
  updatedAt: Date
}

export interface ProductionFormula {
  id: string
  name: string
  description?: string
  businessId: string
  productId: string
  product?: Product
  materials?: FormulaMaterial[]
  createdAt: Date
  updatedAt: Date
}

export interface FormulaMaterial {
  id: string
  formulaId: string
  materialId: string
  material?: Product
  quantity: number
  unit: string
  createdAt: Date
  updatedAt: Date
}



export interface Product {
    id: string
    name: string
    sku?: string
    barcode?: string
    description?: string
    price: number
    cost: number
    quantity: number
    minQuantity: number
    businessId: string
    categoryId: string
    category?: Category
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Category {
    id: string
    name: string
    description?: string
    businessId: string
    products?: Product[]
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Business {
    id: string
    name: string
    description?: string
    logo?: string
    domain?: string
    address?: string
    phone?: string
    email?: string
    website?: string
    ownerId: string
    createdAt: Date
    updatedAt: Date
  }




