'use client'

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useFundingSourceStore } from '@/store/useFundingSourceStore'
import { getFundingSources } from '@/app/actions/funding-source'
import { AddFundingSourceModal } from './_components/add-funding-source-modal'
import { columns } from './_components/funding-source-columns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'

const FundingSources = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { fundingSources, setFundingSources } = useFundingSourceStore()

  useEffect(() => {
    const fetchFundingSources = async () => {
      if (currentBusiness) {
        const result = await getFundingSources(currentBusiness.id)
        if (result.success) {
          setFundingSources(result.fundingSources)
        }
      }
    }
    
    fetchFundingSources()
  }, [currentBusiness, setFundingSources])

  const totalFunding = fundingSources.reduce((sum, fs) => sum + fs.amount, 0)

  const toolbar = (
    <Button onClick={() => setShowAddModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Add Funding Source
    </Button>
  )

  return (
    <div className="space-y-6">
      <div className="section-heading">
        <h2>Funding Sources</h2>
        <p>Manage your business funding sources</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalFunding)}
          </div>
        </CardContent>
      </Card>
      
      <DataTable 
        columns={columns} 
        data={fundingSources} 
        searchKey="name"
        toolbar={toolbar}
      />
      
      {showAddModal && (
        <AddFundingSourceModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}

export default FundingSources