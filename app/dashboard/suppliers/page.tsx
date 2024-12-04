"use client"

import { useEffect, useState } from 'react'
import { Plus, FileText, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useSupplierStore } from '@/store/useSupplierStore'
import { getSuppliers } from '@/app/actions/supplier'
import { CreateSupplierModal } from './_components/create-supplier-modal'
import { columns as supplierColumns } from './_components/supplier-columns'
import Link from 'next/link'

const Suppliers = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { suppliers, setSuppliers } = useSupplierStore()

  useEffect(() => {
    const fetchSuppliers = async () => {
      if (currentBusiness) {
        const result = await getSuppliers(currentBusiness.id)
        if (result.success) {
          setSuppliers(result.suppliers)
        }
      }
    }
    
    fetchSuppliers()
  }, [currentBusiness, setSuppliers])

  const supplierToolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Add Supplier
    </Button>
  )

  return (
    <div className="space-y-4">
     <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Supplier Management</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your suppliers and their information
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Link href="/dashboard/suppliers/orders" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Purchase Orders
            </Button>
          </Link>
          <Link href="/dashboard/suppliers/contracts" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="mr-2 h-4 w-4" />
              Contracts
            </Button>
          </Link>
        </div>
      </div>

      <DataTable 
        columns={supplierColumns} 
        data={suppliers} 
        searchKey="name"
        toolbar={supplierToolbar}
      />
      
      {showCreateModal && (
        <CreateSupplierModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Suppliers