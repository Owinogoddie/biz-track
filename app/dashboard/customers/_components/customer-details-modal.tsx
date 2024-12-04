import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Customer, Debt, InstallmentPlan } from '@prisma/client'
import { formatCurrency } from '@/lib/formatters'

interface CustomerDetailsModalProps {
  customer: Customer & {
    debts: Debt[]
    installmentPlans: InstallmentPlan[]
  }
  onClose: () => void
}

export function CustomerDetailsModal({ customer, onClose }: CustomerDetailsModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{customer.name}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{customer.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{customer.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{customer.address || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Credit Limit</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(customer.creditLimit)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="debts" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="debts">Debts</TabsTrigger>
            <TabsTrigger value="installments">Installments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="debts">
            <Card>
              <CardHeader>
                <CardTitle>Debts</CardTitle>
              </CardHeader>
              <CardContent>
                {customer.debts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No debts found</p>
                ) : (
                  <div className="space-y-4">
                    {customer.debts.map((debt) => (
                      <Card key={debt.id}>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Amount</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(debt.amount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Status</p>
                              <p className="text-sm text-muted-foreground">
                                {debt.status}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Due Date</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(debt.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="installments">
            <Card>
              <CardHeader>
                <CardTitle>Installment Plans</CardTitle>
              </CardHeader>
              <CardContent>
                {customer.installmentPlans.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No installment plans found</p>
                ) : (
                  <div className="space-y-4">
                    {customer.installmentPlans.map((plan) => (
                      <Card key={plan.id}>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Total Amount</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(plan.totalAmount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Paid Amount</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(plan.paidAmount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Status</p>
                              <p className="text-sm text-muted-foreground">
                                {plan.status}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">End Date</p>
                              <p className="text-sm text-muted-foreground">
                                {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}