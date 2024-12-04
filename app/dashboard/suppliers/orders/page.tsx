"use client"

import { useEffect, useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { usePurchaseOrderStore } from '@/store/usePurchaseOrderStore'
import { getPurchaseOrders } from '@/app/actions/purchaseOrder'
import { CreatePOModal } from './_components/create-po-modal'
import { columns } from './_components/purchase-order-columns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { ColumnDef } from '@tanstack/react-table'
import { PurchaseOrder } from '@/types/purchase-order'

const PurchaseOrders = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { purchaseOrders, setPurchaseOrders } = usePurchaseOrderStore()
  const { toast } = useToast()

  useEffect(() => {
    const fetchPOs = async () => {
      if (currentBusiness) {
        const result = await getPurchaseOrders(currentBusiness.id)
        if (result.success) {
          setPurchaseOrders(result.purchaseOrders)
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch purchase orders",
            variant: "destructive",
          })
        }
      }
    }
    
    fetchPOs()
  }, [currentBusiness, setPurchaseOrders, toast])

  const getFilteredPOs = (status?: string) => {
    if (!status || status === 'all') return purchaseOrders
    return purchaseOrders.filter(po => po.status === status.toUpperCase())
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <Link href="/dashboard/suppliers">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Suppliers
              </Button>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight">Purchase Orders</h2>
            <p className="text-muted-foreground">
              Manage and track all purchase orders
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Purchase Order
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        {['all', 'draft', 'sent', 'approved', 'completed'].map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
           <DataTable<PurchaseOrder, unknown>
              columns={columns as ColumnDef<PurchaseOrder, unknown>[]}
              data={getFilteredPOs(status)}
              searchKey="poNumber"
            />
          </TabsContent>
        ))}
      </Tabs>
      
      {showCreateModal && (
        <CreatePOModal 
          // supplierId={currentBusiness?.id || ''} 
          onClose={() => setShowCreateModal(false)} 
        />
      )}
    </div>
  )
}

export default PurchaseOrders