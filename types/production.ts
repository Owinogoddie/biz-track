export interface ProductionBatchInput {
  name: string;
  productId: string;
  businessId: string;
  targetQuantity: number;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}

export interface ActivityInput {
  name: string;
  stageId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  laborHours?: number;
  cost?: number;
  notes?: string;
}

export interface StageInput {
  name: string;
  order: number;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
}

export interface ResourceUsageInput {
  resourceType: 'material' | 'equipment' | 'labor';
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  notes?: string;
}

export interface QualityCheckInput {
  checkpointName: string;
  status: 'passed' | 'failed';
  notes?: string;
}

export interface ProductionMetrics {
  efficiency: number;
  qualityRate: number;
  wasteRate: number;
  laborUtilization: number;
}