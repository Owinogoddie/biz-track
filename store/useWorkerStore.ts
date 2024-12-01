import { create } from 'zustand'
import { Worker } from '@prisma/client'

interface WorkerStore {
  workers: Worker[]
  setWorkers: (workers: Worker[]) => void
  addWorker: (worker: Worker) => void
  updateWorker: (worker: Worker) => void
  removeWorker: (id: string) => void
}

export const useWorkerStore = create<WorkerStore>((set) => ({
  workers: [],
  setWorkers: (workers) => set({ workers }),
  addWorker: (worker) =>
    set((state) => ({ workers: [...state.workers, worker] })),
  updateWorker: (worker) =>
    set((state) => ({
      workers: state.workers.map((w) => (w.id === worker.id ? worker : w)),
    })),
  removeWorker: (id) =>
    set((state) => ({
      workers: state.workers.filter((w) => w.id !== id),
    })),
}))