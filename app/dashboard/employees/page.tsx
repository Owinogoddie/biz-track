"use client"
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useEmployeeStore } from '@/store/useEmployeeStore'
import { getBusinessUsers } from '@/app/actions/employee'
import { CreateEmployeeModal } from './_components/create-employee-modal'
import { columns } from './_components/columns'

const Employees = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { employees, setEmployees } = useEmployeeStore()

  useEffect(() => {
    const fetchEmployees = async () => {
      if (currentBusiness) {
        const result = await getBusinessUsers(currentBusiness.id)
        if (result.success) {
          setEmployees(result.employees)
        }
      }
    }
    
    fetchEmployees()
  }, [currentBusiness, setEmployees])

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Add Employee
    </Button>
  )

  return (
    <div className="space-y-4">
     <div className="section-heading">
        <h2 >Employees</h2>
        <p >
          Manage your business employees here
        </p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={employees} 
        searchKey="email"
        toolbar={toolbar}
      />
      
      {showCreateModal && (
        <CreateEmployeeModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Employees