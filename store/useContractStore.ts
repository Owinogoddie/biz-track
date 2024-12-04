import { create } from 'zustand'
import { SupplierContract } from '@prisma/client'

interface ContractStore {
  contracts: SupplierContract[]
  setContracts: (contracts: SupplierContract[]) => void
  addContract: (contract: SupplierContract) => void
  updateContract: (contract: SupplierContract) => void
  removeContract: (id: string) => void
}

export const useContractStore = create<ContractStore>((set) => ({
  contracts: [],
  setContracts: (contracts) => set({ contracts }),
  addContract: (contract) =>
    set((state) => ({ contracts: [...state.contracts, contract] })),
  updateContract: (contract) =>
    set((state) => ({
      contracts: state.contracts.map((c) => 
        c.id === contract.id ? contract : c
      ),
    })),
  removeContract: (id) =>
    set((state) => ({
      contracts: state.contracts.filter((c) => c.id !== id),
    })),
}))