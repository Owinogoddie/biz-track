"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { useBusinessStore } from "@/store/useBusinessStore"
import { useContractStore } from "@/store/useContractStore"
import { getContracts } from "@/app/actions/contract"
import { CreateContractModal } from "./_components/create-contract-modal"
import { columns } from "./_components/contract-columns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

const Contracts = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { contracts, setContracts } = useContractStore()

  useEffect(() => {
    const fetchContracts = async () => {
      if (currentBusiness) {
        const result = await getContracts(currentBusiness.id)
        if (result.success) {
          setContracts(result.contracts)
        }
      }
    }
    
    fetchContracts()
  }, [currentBusiness, setContracts])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div>
          <Link href="/dashboard/suppliers">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Suppliers
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Contracts</h2>
          <p className="text-muted-foreground">
            Manage supplier contracts and documents
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="terminated">Terminated</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <DataTable 
            columns={columns} 
            data={contracts} 
            searchKey="title"
            toolbar={
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Contract
              </Button>
            }
          />
        </TabsContent>
        
        <TabsContent value="draft" className="space-y-4">
          <DataTable 
            columns={columns} 
            data={contracts.filter(contract => contract.status === "DRAFT")} 
            searchKey="title"
          />
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <DataTable 
            columns={columns} 
            data={contracts.filter(contract => contract.status === "ACTIVE")} 
            searchKey="title"
          />
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <DataTable 
            columns={columns} 
            data={contracts.filter(contract => contract.status === "EXPIRED")} 
            searchKey="title"
          />
        </TabsContent>

        <TabsContent value="terminated" className="space-y-4">
          <DataTable 
            columns={columns} 
            data={contracts.filter(contract => contract.status === "TERMINATED")} 
            searchKey="title"
          />
        </TabsContent>
      </Tabs>
      
      {showCreateModal && (
        <CreateContractModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Contracts