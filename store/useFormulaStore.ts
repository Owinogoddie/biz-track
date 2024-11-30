import { create } from 'zustand'
import { ProductionFormula } from '@prisma/client'

interface FormulaStore {
  formulas: ProductionFormula[]
  setFormulas: (formulas: ProductionFormula[]) => void
  addFormula: (formula: ProductionFormula) => void
  updateFormula: (formula: ProductionFormula) => void
  removeFormula: (id: string) => void
}

export const useFormulaStore = create<FormulaStore>((set) => ({
  formulas: [],
  setFormulas: (formulas) => set({ formulas }),
  addFormula: (formula) =>
    set((state) => ({ formulas: [...state.formulas, formula] })),
  updateFormula: (formula) =>
    set((state) => ({
      formulas: state.formulas.map((f) => (f.id === formula.id ? formula : f)),
    })),
  removeFormula: (id) =>
    set((state) => ({
      formulas: state.formulas.filter((f) => f.id !== id),
    })),
}))