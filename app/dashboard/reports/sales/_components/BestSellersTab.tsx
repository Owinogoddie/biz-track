import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"
import { SellerStats } from "@/types/sale"

interface BestSellersTabProps {
  dailyTopSeller: SellerStats | undefined
  weeklyTopSeller: SellerStats | undefined
  monthlyTopSeller: SellerStats | undefined
  yearlyTopSeller: SellerStats | undefined
  topSellers: SellerStats[]
  totalSales: number
}

export function BestSellersTab({
  dailyTopSeller,
  weeklyTopSeller,
  monthlyTopSeller,
  yearlyTopSeller,
  topSellers,
  totalSales
}: BestSellersTabProps) {
  const formatSellerName = (seller?: SellerStats) => {
    if (!seller) return "No sales";
    if (seller.name) return seller.name;
    // Extract username from email if name is null
    const emailMatch = seller.email?.match(/^([^@]*)@/);
    return emailMatch ? emailMatch[1] : "Unknown Seller";
  };

  const formatSellerInfo = (seller?: SellerStats) => {
    if (!seller) return { name: "No sales", stats: null };
    return {
      name: formatSellerName(seller),
      stats: `KSH ${seller.total.toLocaleString()} (${seller.count} sales)`
    };
  };

  const dailyInfo = formatSellerInfo(dailyTopSeller);
  const weeklyInfo = formatSellerInfo(weeklyTopSeller);
  const monthlyInfo = formatSellerInfo(monthlyTopSeller);
  const yearlyInfo = formatSellerInfo(yearlyTopSeller);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Top Seller</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{dailyInfo.name}</div>
            {dailyInfo.stats && (
              <p className="text-sm text-muted-foreground">{dailyInfo.stats}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Top Seller</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{weeklyInfo.name}</div>
            {weeklyInfo.stats && (
              <p className="text-sm text-muted-foreground">{weeklyInfo.stats}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Top Seller</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{monthlyInfo.name}</div>
            {monthlyInfo.stats && (
              <p className="text-sm text-muted-foreground">{monthlyInfo.stats}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yearly Top Seller</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{yearlyInfo.name}</div>
            {yearlyInfo.stats && (
              <p className="text-sm text-muted-foreground">{yearlyInfo.stats}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Time Best Sellers</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="space-y-8">
            {topSellers.map((seller, index) => (
              <div 
                className="flex items-center" 
                key={`${seller.email || 'unknown'}-${seller.total}-${index}`}
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {formatSellerName(seller)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    KSH {seller.total.toLocaleString()} ({seller.count} sales)
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
  )
}