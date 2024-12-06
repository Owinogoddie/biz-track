import { TransactionType } from '@prisma/client'

export interface CreateExpenditureInput {
  businessId: string
  amount: number
  category: string
  description: string
  date?: Date
  fundingSourceId?: string | null
}

export interface ExpenditureTransaction {
  type: 'EXPENSE'
  total: number
  paid: number
  businessId: string
  fundingSourceId?: string | null
  notes: string
}