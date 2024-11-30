'use server'

export interface CreateProductionInput {
  name: string
  description?: string
  businessId: string
  formulaId: string
  targetQuantity?: number
  estimatedCost?: number
  status?: ProductionStatus
}
import prisma  from '@/lib/prisma'
import { 
    MaterialQualityStatus, 
    ProductionStatus, 
    LaborTaskType, 
    QualityCheckType, 
    QualityStatus,
    Production 
  } from '@/types/production'
import { getUserAction } from '../auth'

export async function createProduction(data: {
    name: string
    description?: string
    businessId: string
    formulaId: string
    targetQuantity?: number
    estimatedCost?: number
  }) {
    console.log(data)
    try {
      const user = await getUserAction()
      
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }
  
      const production = await prisma.production.create({
        data: {
          ...data,
          status: 'PLANNED' as ProductionStatus,
        },
        include: {
          formula: {
            include: {
              product: true,
              materials: {
                include: {
                  material: true
                }
              }
            }
          },
          steps: true,
          materialUsage: {
            include: {
              material: true
            }
          },
          laborRecords: true,
          qualityChecks: true
        }
      })
  
      return { success: true, production }
    } catch (error) {
      console.log(error)
      return { success: false, error: 'Failed to create production' }
    }
  }
  export async function updateProduction(id: string, data: Partial<CreateProductionInput>) {
    try {
      const userResult = await getUserAction()
      
      if (!userResult.success || !userResult.user) {
        return { success: false, error: 'User not authenticated' }
      }
  
      const production = await prisma.production.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          formulaId: data.formulaId,
          targetQuantity: data.targetQuantity,
          estimatedCost: data.estimatedCost,
          status: data.status,
        }
      })
  
      return { success: true, production }
    } catch (error: any) {
      return { success: false, error: 'Failed to update production' }
    }
  }
  export async function getProductions(businessId: string): Promise<{ success: boolean; productions?: Production[]; error?: string }> {
    try {
      const productions = await prisma.production.findMany({
        where: { businessId },
        include: {
          formula: {
            include: {
              product: true,
              materials: {
                include: {
                  material: true
                }
              }
            }
          },
          steps: true,
          materialUsage: {
            include: {
              material: true
            }
          },
          laborRecords: true,
          qualityChecks: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }) as unknown as Production[]
      
      return { success: true, productions }
    } catch (error) {
      return { success: false, error: 'Failed to fetch productions' }
    }
  }
  

export async function recordMaterialUsage(data: {
  productionId: string
  materialId: string
  actualQuantity: number
  unit: string
  costPerUnit: number
  notes?: string
  qualityStatus?: MaterialQualityStatus
  wasteQuantity?: number
  wasteReason?: string
}) {
  try {
    const materialUsage = await prisma.materialUsage.create({
      data: {
        ...data,
        totalCost: data.actualQuantity * data.costPerUnit,
        usageDate: new Date(),
        qualityStatus: data.qualityStatus || MaterialQualityStatus.GOOD
      },
      include: {
        material: true
      }
    })
    return { success: true, materialUsage }
  } catch (error) {
    return { success: false, error: 'Failed to record material usage' }
  }
}


export async function recordLabor(data: {
  productionId: string
  workerId: string
  workerName: string
  taskType: LaborTaskType
  startTime: Date
  endTime?: Date
  hourlyRate: number
  notes?: string
}) {
  try {
    // Validate required fields
    if (!data.productionId || !data.workerId || !data.workerName || !data.taskType || !data.startTime || !data.hourlyRate) {
      console.error('Missing required fields:', data);
      return { success: false, error: 'Missing required fields' };
    }

    const hoursWorked = data.endTime 
      ? (data.endTime.getTime() - data.startTime.getTime()) / (1000 * 60 * 60)
      : null;

    // Log the data being sent to the database
    console.log('Creating labor record with data:', {
      ...data,
      hoursWorked,
      totalCost: hoursWorked ? hoursWorked * data.hourlyRate : 0
    });

    const laborRecord = await prisma.laborRecord.create({
      data: {
        productionId: data.productionId,
        workerId: data.workerId,
        workerName: data.workerName,
        taskType: data.taskType,
        startTime: data.startTime,
        endTime: data.endTime || null,
        hourlyRate: data.hourlyRate,
        hoursWorked,
        totalCost: hoursWorked ? hoursWorked * data.hourlyRate : 0,
        notes: data.notes || null
      }
    });

    return { success: true, laborRecord };
  } catch (error) {
    // Log the actual error
    console.error('Error creating labor record:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to record labor'
    };
  }
}

  export async function recordQualityCheck(data: {
    productionId: string
    checkType: QualityCheckType
    checkedBy: string
    parameters?: any
    notes?: string
    status?: QualityStatus
  }) {
    try {
      const qualityCheck = await prisma.qualityCheck.create({
        data: {
          ...data,
          checkedAt: new Date(),
          status: data.status || QualityStatus.PENDING
        }
      })
      return { success: true, qualityCheck }
    } catch (error) {
      return { success: false, error: 'Failed to record quality check' }
    }
  }
  
  export async function updateProductionStatus(
    productionId: string,
    status: ProductionStatus,
    notes?: string
  ) {
    try {
      const production = await prisma.production.update({
        where: { id: productionId },
        data: { 
          status,
          steps: {
            create: {
              name: `Status updated to ${status}`,
              status,
              notes,
              orderIndex: 0
            }
          }
        },
        include: {
          steps: true,
          materialUsage: true,
          laborRecords: true,
          qualityChecks: true
        }
      })
      return { success: true, production }
    } catch (error) {
      return { success: false, error: 'Failed to update production status' }
    }
  }