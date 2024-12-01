import { create } from 'zustand'
import { BusinessUser } from '@prisma/client'

interface EmployeeStore {
  employees: BusinessUser[]
  setEmployees: (employees: BusinessUser[]) => void
  addEmployee: (employee: BusinessUser) => void
  updateEmployee: (employee: BusinessUser) => void
  removeEmployee: (id: string) => void
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  setEmployees: (employees) => set({ employees }),
  addEmployee: (employee) =>
    set((state) => ({ employees: [...state.employees, employee] })),
  updateEmployee: (employee) =>
    set((state) => ({
      employees: state.employees.map((e) => (e.id === employee.id ? employee : e)),
    })),
  removeEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((e) => e.id !== id),
    })),
}))