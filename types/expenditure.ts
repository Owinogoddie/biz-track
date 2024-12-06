import { Expenditure as PrismaExpenditure, FundingSource } from "@prisma/client"

export interface ExpenditureWithFundingSource extends PrismaExpenditure {
  fundingSource?: FundingSource | null
}