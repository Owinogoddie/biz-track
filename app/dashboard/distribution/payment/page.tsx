import { useEffect, useState } from 'react'
import { useBusinessStore } from '@/store/useBusinessStore'
import { usePaymentStore } from '@/store/usePaymentStore'
import { PaymentStatus } from '@prisma/client'
import { DataTable } from '@/components/ui/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { columns } from './_components/payment-columns'
import { CreatePaymentModal } from './_components/create-payment-modal'
import { getPayments } from '@/app/actions/payment'

const Payments = () => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { currentBusiness } = useBusinessStore()
  const { payments, setPayments } = usePaymentStore()

  useEffect(() => {
    const fetchPayments = async () => {
      if (currentBusiness) {
        const result = await getPayments(currentBusiness.id)
        if (result.success) {
          setPayments(result.payments)
        }
      }
    }
    
    fetchPayments()
  }, [currentBusiness, setPayments])

  // Calculate summary statistics
  const totalPaid = payments
  .filter(p => p.paymentStatus === PaymentStatus.PAID)
  .reduce((sum, p) => sum + p.amount, 0)

const totalPending = payments
  .filter(p => p.paymentStatus === PaymentStatus.PENDING)
  .reduce((sum, p) => sum + p.amount, 0)

const totalOverdue = payments
  .filter(p => p.paymentStatus === PaymentStatus.OVERDUE)
  .reduce((sum, p) => sum + p.amount, 0)

  const toolbar = (
    <Button onClick={() => setShowCreateModal(true)}>
      <Plus className="mr-2 h-4 w-4" /> Record Payment
    </Button>
  )

  return (
    <div className="space-y-6">
      <div className="section-heading">
        <h2>Payments</h2>
        <p>Track and manage all your payment transactions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalPaid.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${totalPending.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalOverdue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <DataTable 
        columns={columns} 
        data={payments} 
        searchKey="reference"
        toolbar={toolbar}
      />
      
      {showCreateModal && (
        <CreatePaymentModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Payments