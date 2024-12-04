'use client'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { useBusinessStore } from "@/store/useBusinessStore"
import { useExpenditureStore } from "@/store/useExpenditureStore"
import { getColumns } from "./_components/columns"
import { ExpenditureFormModal } from "./_components/expenditure-form-modal"
import { getExpenditures } from "@/app/actions/expenditure"
import { getSales } from "@/app/actions/sale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { addDays } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/formatters"
import { DatePickerWithRange } from "@/components/DateRangePicker"
import { DateRange } from "react-day-picker"

export default function Expenditures() {
    const currentBusiness = useBusinessStore((state) => state.currentBusiness)
    const { expenditures, setExpenditures } = useExpenditureStore()
    const [sales, setSales] = useState<any[]>([])
    const [dateRange, setDateRange] = useState<DateRange>({
      from: addDays(new Date(), -30),
      to: new Date(),
    })
    const [groupBy, setGroupBy] = useState<"daily" | "monthly" | "category">("monthly")
  
    useEffect(() => {
      async function fetchData() {
        if (!currentBusiness) return
        const expResult = await getExpenditures(currentBusiness.id)
        if (expResult.success) {
          setExpenditures(expResult.expenditures)
        }
        const salesResult = await getSales(currentBusiness.id)
        if (salesResult.success) {
          setSales(salesResult.sales)
        }
      }
      fetchData()
    }, [currentBusiness, setExpenditures])
  
    const filteredExpenditures = expenditures.filter(exp => {
      const expDate = new Date(exp.date)
      return dateRange.from && dateRange.to && 
             expDate >= dateRange.from && 
             expDate <= dateRange.to
    })
  
    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return dateRange.from && dateRange.to && 
             saleDate >= dateRange.from && 
             saleDate <= dateRange.to
    })
  const totalExpenses = filteredExpenditures.reduce((sum, exp) => sum + exp.amount, 0)
  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const netIncome = totalSales - totalExpenses

  const categoryData = filteredExpenditures.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)

  const getChartData = () => {
    if (groupBy === "category") {
      return Object.entries(categoryData).map(([category, amount]) => ({
        name: category,
        expenses: amount
      }))
    }

    const data: any[] = []
    let format = groupBy === "daily" ? "MM/dd" : "yyyy-MM"
    
    filteredExpenditures.forEach(exp => {
      const date = new Date(exp.date)
      const key = date.toLocaleDateString('en-US', 
        groupBy === "daily" 
          ? { month: "2-digit", day: "2-digit" }
          : { year: "numeric", month: "2-digit" }
      )
      
      const existingEntry = data.find(d => d.name === key)
      if (existingEntry) {
        existingEntry.expenses += exp.amount
      } else {
        data.push({ name: key, expenses: exp.amount })
      }
    })

    filteredSales.forEach(sale => {
      const date = new Date(sale.createdAt)
      const key = date.toLocaleDateString('en-US',
        groupBy === "daily"
          ? { month: "2-digit", day: "2-digit" }
          : { year: "numeric", month: "2-digit" }
      )
      
      const existingEntry = data.find(d => d.name === key)
      if (existingEntry) {
        existingEntry.sales = (existingEntry.sales || 0) + sale.total
      } else {
        data.push({ name: key, sales: sale.total, expenses: 0 })
      }
    })

    return data.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime())
  }

  const availableBalance = totalSales - totalExpenses
  
  const columns = getColumns({ totalSales, expenditures })
  return (
    <div className=" mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <h1 className="text-3xl font-bold">Expenditures</h1>
        <ExpenditureFormModal availableBalance={availableBalance}>
                  <Button>Add Expenditure</Button>
        </ExpenditureFormModal>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        <Select value={groupBy} onValueChange={(value: "daily" | "monthly" | "category") => setGroupBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select grouping" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="category">By Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalSales)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netIncome)}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{groupBy === "category" ? "Expenses by Category" : "Sales vs Expenses"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getChartData()}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                {label}
                              </span>
                              {payload.map((entry) => (
                                <span key={entry.name} className="font-bold text-muted-foreground">
                                  {entry.name}: {formatCurrency(Number(entry.value) || 0)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend />
                <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                {groupBy !== "category" && (
                  <Bar dataKey="sales" name="Sales" fill="#22c55e" />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <DataTable columns={columns} data={filteredExpenditures} 
        searchKey="category"/>
    </div>
  )
}