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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { format, subDays, subMonths, startOfYear, endOfYear } from "date-fns"
import { Loader2, DollarSign, TrendingUp, Users, Package, Award, TrendingDown } from "lucide-react"
import { DataTable } from "./_components/SalesTable"
import { columns } from "./_components/columns"
import { Sale, SellerStats, DateRangeType } from "@/types/sale"
import { BestSellersTab } from "./_components/BestSellersTab"
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SalesDashboard = () => {
  const [sales, setSales] = useState<Sale[]>([])
  const [bestSellers, setBestSellers] = useState<any[]>([])
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

  // Calculate seller statistics for different time periods
  const calculateSellerStats = (salesData: Sale[]) => {
    return salesData.reduce<Record<string, SellerStats>>((acc, sale) => {
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
  }

  // Get top sellers for different time periods
  const now = new Date()
  const dailySales = sales.filter(sale => 
    new Date(sale.createdAt) >= subDays(now, 1)
  )
  const weeklySales = sales.filter(sale => 
    new Date(sale.createdAt) >= subDays(now, 7)
  )
  const monthlySales = sales.filter(sale => 
    new Date(sale.createdAt) >= subDays(now, 30)
  )
  const yearlySales = sales.filter(sale => 
    new Date(sale.createdAt) >= subMonths(now, 12)
  )

  const dailyTopSeller = Object.values(calculateSellerStats(dailySales))
    .sort((a, b) => b.total - a.total)[0]
  const weeklyTopSeller = Object.values(calculateSellerStats(weeklySales))
    .sort((a, b) => b.total - a.total)[0]
  const monthlyTopSeller = Object.values(calculateSellerStats(monthlySales))
    .sort((a, b) => b.total - a.total)[0]
  const yearlyTopSeller = Object.values(calculateSellerStats(yearlySales))
    .sort((a, b) => b.total - a.total)[0]
    const topSellers = Object.values(calculateSellerStats(filteredSales))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  // Calculate product performance
  const productStats = filteredSales.reduce((acc: any, sale) => {
    sale.items.forEach((item: any) => {
      if (!acc[item.product.id]) {
        acc[item.product.id] = {
          name: item.product.name,
          quantity: 0,
          revenue: 0
        }
      }
      acc[item.product.id].quantity += item.quantity
      acc[item.product.id].revenue += item.price * item.quantity
    })
    return acc
  }, {})

  const productPerformance = Object.values(productStats)
    .sort((a: any, b: any) => b.revenue - a.revenue)

  const topProducts = productPerformance.slice(0, 5)
  const bottomProducts = [...productPerformance].sort((a: any, b: any) => a.revenue - b.revenue).slice(0, 5)

  // Calculate daily sales for chart
  const dailySalesData = filteredSales.reduce<Record<string, number>>((acc, sale) => {
    const date = format(new Date(sale.createdAt), "MMM dd")
    if (!acc[date]) {
      acc[date] = 0
    }
    acc[date] += sale.total
    return acc
  }, {})

  const chartData = Object.entries(dailySalesData).map(([date, total]) => ({
    date,
    total,
  }))

  const productChartData = topProducts.map((product: any) => ({
    name: product.name,
    value: product.revenue
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
            <div className="text-2xl font-bold">KSH {totalSales.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Ticket</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSH {averageTicket.toLocaleString()}</div>
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
            <div className="text-2xl font-bold">{Object.keys(calculateSellerStats(filteredSales)).length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Top Seller</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{dailyTopSeller?.name || "No sales"}</div>
            {dailyTopSeller && (
              <p className="text-sm text-muted-foreground">
                KSH {dailyTopSeller.total.toLocaleString()} ({dailyTopSeller.count} sales)
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Top Seller</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{weeklyTopSeller?.name || "No sales"}</div>
            {weeklyTopSeller && (
              <p className="text-sm text-muted-foreground">
                KSH {weeklyTopSeller.total.toLocaleString()} ({weeklyTopSeller.count} sales)
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Top Seller</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{monthlyTopSeller?.name || "No sales"}</div>
            {monthlyTopSeller && (
              <p className="text-sm text-muted-foreground">
                KSH {monthlyTopSeller.total.toLocaleString()} ({monthlyTopSeller.count} sales)
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yearly Top Seller</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{yearlyTopSeller?.name || "No sales"}</div>
            {yearlyTopSeller && (
              <p className="text-sm text-muted-foreground">
                KSH {yearlyTopSeller.total.toLocaleString()} ({yearlyTopSeller.count} sales)
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="sellers">Best Sellers</TabsTrigger>
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
                    <Tooltip formatter={(value) => `KSH ${Number(value).toLocaleString()}`} />
                    <Bar dataKey="total" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Products Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={productChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `KSH ${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="products">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {topProducts.map((product: any) => (
                    <div className="flex items-center" key={product.name}>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          KSH {product.revenue.toLocaleString()} ({product.quantity} units)
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {((product.revenue / totalSales) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lowest Performing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {bottomProducts.map((product: any) => (
                    <div className="flex items-center" key={product.name}>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          KSH {product.revenue.toLocaleString()} ({product.quantity} units)
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {((product.revenue / totalSales) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="sellers">
          <BestSellersTab
            dailyTopSeller={dailyTopSeller}
            weeklyTopSeller={weeklyTopSeller}
            monthlyTopSeller={monthlyTopSeller}
            yearlyTopSeller={yearlyTopSeller}
            topSellers={topSellers}
            totalSales={totalSales}
          />
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