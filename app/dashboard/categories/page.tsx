'use client'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useCategoryStore } from '@/store/useCategoryStore'
import { getCategories } from '@/app/actions/category'
import { CreateCategoryModal } from './_components/create-category-modal'
import { columns } from './_components/columns'

const Categories = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { categories, setCategories } = useCategoryStore()

  useEffect(() => {
    const fetchCategories = async () => {
      if (currentBusiness) {
        const result = await getCategories(currentBusiness.id)
        if (result.success) {
          setCategories(result.categories)
        }
      }
    }
    
    fetchCategories()
  }, [currentBusiness, setCategories])

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Add Category
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="section-heading">
        <h2 >Categories</h2>
        <p >
          Manage your product categories here
        </p>
      </div>
      
      <DataTable 
        columns={columns} 
        data={categories} 
        searchKey="name"
        toolbar={toolbar}
      />
      
      {showCreateModal && (
        <CreateCategoryModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Categories