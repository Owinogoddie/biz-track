'use client'

import { useState } from 'react'
import { useInventoryStore } from '@/store/useInventoryStore'
import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'

export function AssetsList() {
  const { assets } = useInventoryStore()
  
  return (
    <div className="space-y-4">
      <DataTable 
        columns={columns} 
        data={assets} 
        searchKey="name"
      />
    </div>
  )
}