"use client"

import { useEffect, useState } from "react"
import { useBusinessStore } from "@/store/useBusinessStore"
import { getSales } from "@/app/actions/sale"
import { DatePickerWithRange } from "@/components/DateRangePicker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { format } from "date-fns"
import { Loader2, DollarSign, TrendingUp, Users, Package } from "lucide-react"
import { DataTable } from "./_components/SalesTable"
import { columns } from "./_components/columns"
import { Sale, SellerStats, DateRangeType } from "@/types/sale"

const SalesDashboard = () => {
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { currentBusiness } = useBusinessStore()
  const { toast } = useToast()
  const [dateRange, setDateRange] = useState<DateRangeType>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  })

  useEffect(() => {
    const fetchSales = async () => {
      if (!currentBusiness) return
      
      setIsLoading(true)
      const result = await getSales(currentBusiness.id)
      
      if (result.success && result.sales) {
        setSales(result.sales as Sale[])
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
      }
      setIsLoading(false)
    }

    fetchSales()
  }, [currentBusiness, dateRange, toast])

  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.createdAt)
    return saleDate >= dateRange.from && saleDate <= dateRange.to
  })

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const averageTicket = totalSales / (filteredSales.length || 1)

  // Calculate top sellers with proper typing
  const sellerStats = filteredSales.reduce<Record<string, SellerStats>>((acc, sale) => {
    const sellerId = sale.sellerId
    if (!acc[sellerId]) {
      acc[sellerId] = {
        name: sale.seller.name,
        total: 0,
        count: 0,
      }
    }
    acc[sellerId].total += sale.total
    acc[sellerId].count += 1
    return acc
  }, {})

  const topSellers = Object.values(sellerStats)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  // Calculate daily sales for chart
  const dailySales = filteredSales.reduce<Record<string, number>>((acc, sale) => {
    const date = format(new Date(sale.createdAt), "MMM dd")
    if (!acc[date]) {
      acc[date] = 0
    }
    acc[date] += sale.total
    return acc
  }, {})

  const chartData = Object.entries(dailySales).map(([date, total]) => ({
    date,
    total,
  }))
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full md:h-[calc(100vh-4rem)] md:p-8 space-y-8 overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Sales Dashboard</h2>
        <DatePickerWithRange 
          date={{ from: dateRange.from, to: dateRange.to }} 
          setDate={(newDate) => {
            if (newDate?.from) {
              setDateRange({
                from: newDate.from,
                to: newDate.to
              })
            }
          }} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Ticket</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageTicket.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredSales.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(sellerStats).length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {topSellers.map((seller) => (
                    <div className="flex items-center" key={seller.name}>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{seller.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ${seller.total.toFixed(2)} ({seller.count} sales)
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {((seller.total / totalSales) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={filteredSales} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SalesDashboard