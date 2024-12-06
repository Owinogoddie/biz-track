import prisma from '@/lib/prisma'

export async function validateAndUpdateFundingSource(
  tx: any,
  fundingSourceId: string | null | undefined,
  amount: number,
  operation: 'add' | 'subtract'
) {
  if (!fundingSourceId) return

  const fundingSource = await tx.fundingSource.findUnique({
    where: { id: fundingSourceId },
    include: {
      expenditures: true,
    }
  })

  if (!fundingSource) {
    throw new Error('Funding source not found')
  }

  const usedAmount = fundingSource.expenditures.reduce((sum, e) => sum + e.amount, 0)
  const availableBalance = fundingSource.amount - usedAmount

  if (operation === 'subtract' && amount > availableBalance) {
    throw new Error('Insufficient funds in funding source')
  }

  const newAmount = operation === 'add' 
    ? fundingSource.amount + amount
    : fundingSource.amount - amount

  await tx.fundingSource.update({
    where: { id: fundingSourceId },
    data: {
      amount: newAmount
    }
  })
}