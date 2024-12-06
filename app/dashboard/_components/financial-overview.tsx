import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Wallet } from "lucide-react";

interface FinancialOverviewProps {
  currentMonthSales: number;
  currentMonthExpenditures: number;
  previousMonthBalance: number;
  initialBalance: number;
}

export function FinancialOverview({
  currentMonthSales,
  currentMonthExpenditures,
  previousMonthBalance,
  initialBalance
}: FinancialOverviewProps) {
  const currentProfit = currentMonthSales - currentMonthExpenditures;
  const isProfit = currentProfit > 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Month Profit/Loss</CardTitle>
          {isProfit ? (
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <span className={isProfit ? "text-green-500" : "text-red-500"}>
              {formatCurrency(Math.abs(currentProfit))}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Sales: {formatCurrency(currentMonthSales)} | 
            Expenses: {formatCurrency(currentMonthExpenditures)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Previous Month Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(previousMonthBalance)}</div>
          <p className="text-xs text-muted-foreground">
            Opening balance from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Initial Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(initialBalance)}</div>
          <p className="text-xs text-muted-foreground">
            Starting capital
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(initialBalance + previousMonthBalance + currentProfit)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total capital + profits
          </p>
        </CardContent>
      </Card>
    </div>
  );
}