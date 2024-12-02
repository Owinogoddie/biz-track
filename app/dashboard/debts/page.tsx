'use client'
import { useEffect, useState } from 'react'
import { Plus, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useDebtStore } from '@/store/useDebtStore'
import { getDebts } from '@/app/actions/debt'
import { Badge } from '@/components/ui/badge'
import { CreateDebtModal } from './_components/create-debt-modal'
import { columns } from './_components/debt-columns'
import { formatCurrency } from '@/lib/formatters'
import { Debt, Payment, Transaction } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'

export interface DebtWithTransaction extends Debt {
    transaction: Transaction & {
      payments: Payment[]
    }
  }
  const Debts = () => {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const { currentBusiness } = useBusinessStore()
    const { debts, setDebts } = useDebtStore()
  
    useEffect(() => {
      const fetchDebts = async () => {
        if (currentBusiness) {
          const result = await getDebts(currentBusiness.id)
          if (result.success) {
            setDebts(result.debts)
          }
        }
      }
      
      fetchDebts()
    }, [currentBusiness, setDebts])
  
    const totalOutstanding = debts.reduce((sum, debt) => {
      const paid = debt.transaction.payments.reduce((total, payment) => total + payment.amount, 0)
      return sum + (debt.amount - paid)
    }, 0)
  
    const toolbar = (
      <Button onClick={() => setShowCreateModal(true)}>
        <Plus className="mr-2 h-4 w-4" /> Add Debt
      </Button>
    )
  
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Debts</h2>
            <p className="text-muted-foreground">
              Manage your customer debts here
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Outstanding</p>
              <p className="text-2xl font-bold">
                {formatCurrency(totalOutstanding)}
              </p>
            </div>
          </div>
        </div>
{/*         
        <DataTable<DebtWithTransaction>
        columns={columns} 
        data={debts} 
        searchKey="customerName"
        toolbar={toolbar}
      /> */}

<DataTable<DebtWithTransaction, unknown>
        columns={columns as ColumnDef<DebtWithTransaction, unknown>[]} 
        data={debts} 
        searchKey="customerName"
        toolbar={toolbar}
      />
        
        {showCreateModal && (
          <CreateDebtModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    )
  }
  
  export default Debts