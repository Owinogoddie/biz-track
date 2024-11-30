import { Prisma } from '@prisma/client'

export type CreateProductInput = {
  name: string
  description?: string | null
  sku?: string | null
  barcode?: string | null
  price: number
  cost: number
  quantity: number
  minQuantity: number
  businessId: string
  categoryIds: string[]
}

export type UpdateProductInput = Partial<CreateProductInput>

export type ProductCreateData = Omit<CreateProductInput, 'categoryIds'> & {
  categories: {
    connect: { id: string }[]
  }
}

export type ProductUpdateData = Omit<Partial<CreateProductInput>, 'categoryIds'> & {
  categories?: {
    set: { id: string }[]
  }
}