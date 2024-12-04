"use server"

import prisma from "@/lib/prisma"
import { getUserAction } from "../auth"
export interface CreateContractInput {
  title: string
  supplierId: string
  businessId: string
  startDate: Date
  endDate?: Date | null
  terms?: string | null
  value?: number | null
}

export async function createContract(data: CreateContractInput) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "User not authenticated" }
    }

    const contract = await prisma.supplierContract.create({
      data
    })

    return { success: true, contract }
  } catch (error: any) {
    console.log(error)
    return { success: false, error: "Failed to create contract" }
  }
}

export async function getContracts(businessId: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "User not authenticated" }
    }

    const contracts = await prisma.supplierContract.findMany({
      where: { businessId },
      include: {
        supplier: true,
        documents: true
      }
    })

    return { success: true, contracts }
  } catch (error) {
    return { success: false, error: "Failed to fetch contracts" }
  }
}

export async function updateContractStatus(id: string, status: "DRAFT" | "ACTIVE" | "EXPIRED" | "TERMINATED") {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "User not authenticated" }
    }

    const contract = await prisma.supplierContract.update({
      where: { id },
      data: { status }
    })

    return { success: true, contract }
  } catch (error) {
    return { success: false, error: "Failed to update contract status" }
  }
}

export async function addContractDocument(contractId: string, document: { name: string, fileUrl: string, fileType: string }) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "User not authenticated" }
    }

    const contractDocument = await prisma.contractDocument.create({
      data: {
        ...document,
        contractId
      }
    })

    return { success: true, document: contractDocument }
  } catch (error) {
    return { success: false, error: "Failed to add contract document" }
  }
}

export async function updateContract(id: string, data: any) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "User not authenticated" }
    }

    const contract = await prisma.supplierContract.update({
      where: { id },
      data
    })

    return { success: true, contract }
  } catch (error) {
    return { success: false, error: "Failed to update contract" }
  }
}

export async function deleteContract(id: string) {
  try {
    const userResult = await getUserAction()
    
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "User not authenticated" }
    }

    await prisma.supplierContract.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete contract" }
  }
}