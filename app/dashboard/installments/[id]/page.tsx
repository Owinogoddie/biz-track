'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getInstallmentPlan, deleteInstallmentPlan, deleteInstallmentPayment } from '@/app/actions/installment'
import { Calendar, DollarSign, User, Trash2, Edit, Plus, Package, ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { AddPaymentModal } from '../_components/add-payment-modal'
import { EditInstallmentModal } from '../_components/edit-installment-modal'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { PaymentActions } from '../_components/PaymentActions'

const InstallmentPlanDetails = () => {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [plan, setPlan] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)

  const handleDeletePayment = async (paymentId: string) => {
    const result = await deleteInstallmentPayment(paymentId)
    if (result.success) {
      toast({
        title: 'Payment deleted',
        description: 'The payment has been deleted successfully.',
      })
      fetchPlan()
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to delete payment',
      })
    }
  }

  const handleEditPayment = (payment: any) => {
    setSelectedPayment(payment)
    setShowPaymentModal(true)
  }

  const fetchPlan = async () => {
    if (params.id) {
      const result = await getInstallmentPlan(params.id as string)
      if (result.success) {
        setPlan(result.plan)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlan()
  }, [params.id])

  const handleDelete = async () => {
    if (!plan) return
    
    const result = await deleteInstallmentPlan(plan.id)
    if (result.success) {
      toast({
        title: 'Plan deleted',
        description: 'The installment plan has been deleted successfully.',
      })
      router.push('/dashboard/installments')
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to delete plan',
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!plan) {
    return <div>Plan not found</div>
  }

  const progress = (plan.paidAmount / plan.totalAmount) * 100

  return (
    <div className="space-y-6">
         <Button
        variant="ghost"
        onClick={() => router.push('/dashboard/installments')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Installments
      </Button>
      <div className="flex justify-between items-center flex-wrap">
        <h2 className="text-3xl font-bold">Installment Plan Details</h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={() => setShowPaymentModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Payment
          </Button>
          <Button variant="outline" onClick={() => setShowEditModal(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Plan
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Plan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the installment plan
                  and all its payment records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              KES {plan.totalAmount.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              KES {plan.paidAmount.toLocaleString()} paid
            </div>
            <Progress value={progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan.customer.name}</div>
            <div className="text-xs text-muted-foreground">
              {plan.customer.phone || 'No phone'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan.status}</div>
            <div className="text-xs text-muted-foreground">
              Started {new Date(plan.startDate).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Details</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plan.product.name}</div>
            <div className="text-xs text-muted-foreground">
              Cost: KES {plan.product.cost.toLocaleString()}
              <br />
              Price: KES {plan.product.price.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.payments.map((payment: any) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>KES {payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.notes || '-'}</TableCell>
                  <TableCell>
                    <PaymentActions
                      payment={payment}
                      onEdit={handleEditPayment}
                      onDelete={handleDeletePayment}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showPaymentModal && (
        <AddPaymentModal
          installmentPlanId={plan.id}
          existingPayment={selectedPayment}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedPayment(null)
          }}
          onSuccess={() => {
            setShowPaymentModal(false)
            setSelectedPayment(null)
            fetchPlan()
          }}
        />
      )}

      {showEditModal && (
        <EditInstallmentModal
          installmentPlan={plan}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false)
            fetchPlan()
          }}
        />
      )}
    </div>
  )
}

export default InstallmentPlanDetails