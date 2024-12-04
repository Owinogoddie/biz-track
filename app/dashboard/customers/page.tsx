'use client'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useCustomerStore } from '@/store/useCustomerStore'
import { getCustomers } from '@/app/actions/customer'
import { CustomerFormModal } from './_components/customer-form-modal'
import { columns } from './_components/columns'

const Customers = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { customers, setCustomers } = useCustomerStore()

  useEffect(() => {
    const fetchCustomers = async () => {
      if (currentBusiness) {
        const result = await getCustomers(currentBusiness.id)
        if (result.success) {
          setCustomers(result.customers)
        }
      }
    }
    
    fetchCustomers()
  }, [currentBusiness, setCustomers])

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Add Customer
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="section-heading">
        <h2>Customers</h2>
        <p>Manage your customers and view their details</p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={customers} 
        searchKey="name"
        toolbar={toolbar}
      />
      
      {showCreateModal && (
        <CustomerFormModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Customers