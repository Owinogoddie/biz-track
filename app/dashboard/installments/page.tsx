'use client'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useInstallmentStore } from '@/store/useInstallmentStore'
import { getInstallmentPlans } from '@/app/actions/installment'
import { getProducts } from '@/app/actions/product'
import { getCustomers } from '@/app/actions/customer'
import { CreateInstallmentModal } from './_components/create-installment-modal'
import { columns } from './_components/columns'

const InstallmentPlans = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const { currentBusiness } = useBusinessStore()
  const { installmentPlans, setInstallmentPlans } = useInstallmentStore()

  useEffect(() => {
    const fetchData = async () => {
      if (currentBusiness) {
        const [plansResult, productsResult, customersResult] = await Promise.all([
          getInstallmentPlans(currentBusiness.id),
          getProducts(currentBusiness.id),
          getCustomers(currentBusiness.id)
        ])
        
        if (plansResult.success) {
          setInstallmentPlans(plansResult.plans)
        }
        if (productsResult.success) {
          setProducts(productsResult.products)
        }
        if (customersResult.success) {
          setCustomers(customersResult.customers)
        }
      }
    }
    
    fetchData()
  }, [currentBusiness, setInstallmentPlans])

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> New Installment Plan
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="section-heading">
        <h2>Lipa Mdogo Mdogo Plans</h2>
        <p>Manage your installment payment plans</p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={installmentPlans} 
        searchKey="customer.name"
        toolbar={toolbar}
      />
      
      {showCreateModal && (
        <CreateInstallmentModal 
          products={products}
          customers={customers}
          onClose={() => setShowCreateModal(false)} 
        />
      )}
    </div>
  )
}

export default InstallmentPlans