import { create } from 'zustand';
import type { InventoryAsset, MaintenanceLog } from '@prisma/client';

interface InventoryStore {
  assets: InventoryAsset[];
  maintenanceLogs: MaintenanceLog[];
  setAssets: (assets: InventoryAsset[]) => void;
  addAsset: (asset: InventoryAsset) => void;
  updateAsset: (asset: InventoryAsset) => void;
  removeAsset: (id: string) => void;
  addMaintenanceLog: (log: MaintenanceLog) => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  assets: [],
  maintenanceLogs: [],
  setAssets: (assets) => set({ assets }),
  addAsset: (asset) => set((state) => ({ 
    assets: [...state.assets, asset] 
  })),
  updateAsset: (asset) => set((state) => ({
    assets: state.assets.map((a) => (a.id === asset.id ? asset : a))
  })),
  removeAsset: (id) => set((state) => ({
    assets: state.assets.filter((a) => a.id !== id)
  })),
  addMaintenanceLog: (log) => set((state) => ({
    maintenanceLogs: [...state.maintenanceLogs, log]
  })),
}));