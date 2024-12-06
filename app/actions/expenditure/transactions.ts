import { TransactionType } from '@prisma/client'
import type { ExpenditureTransaction } from './types'

export async function createExpenditureTransaction(
  tx: any,
  data: ExpenditureTransaction
) {
  return tx.transaction.create({
    data: {
      type: TransactionType.EXPENSE,
      total: data.total,
      paid: data.paid,
      businessId: data.businessId,
      fundingSourceId: data.fundingSourceId,
      notes: data.notes,
    }
  })
}

export async function deleteExpenditureTransaction(
  tx: any,
  fundingSourceId: string | null | undefined,
  description: string
) {
  return tx.transaction.deleteMany({
    where: {
      type: TransactionType.EXPENSE,
      fundingSourceId: fundingSourceId,
      notes: { contains: `Expenditure: ${description}` }
    }
  })
}