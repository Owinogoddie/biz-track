import { create } from 'zustand'
import { Material } from '@/types/material'

interface MaterialStore {
  materials: Material[]
  setMaterials: (materials: Material[]) => void
  addMaterial: (material: Material) => void
}

export const useMaterialStore = create<MaterialStore>((set) => ({
  materials: [],
  setMaterials: (materials) => set({ materials }),
  addMaterial: (material) => set((state) => ({ 
    materials: [...state.materials, material] 
  })),
}))