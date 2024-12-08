import { create } from 'zustand'
import { DistributionClient, ClientType } from '@prisma/client'

interface DistributionClientStore {
  clients: DistributionClient[]
  setClients: (clients: DistributionClient[]) => void
  addClient: (client: DistributionClient) => void
  updateClient: (client: DistributionClient) => void
  removeClient: (id: string) => void
}

export const useDistributionClientStore = create<DistributionClientStore>((set) => ({
  clients: [],
  setClients: (clients) => set({ clients }),
  addClient: (client) =>
    set((state) => ({ clients: [...state.clients, client] })),
  updateClient: (client) =>
    set((state) => ({
      clients: state.clients.map((c) => (c.id === client.id ? client : c)),
    })),
  removeClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    })),
}))