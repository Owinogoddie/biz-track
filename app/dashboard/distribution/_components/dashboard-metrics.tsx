import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "../actions/dashboard";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";

export function DashboardMetrics() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: getDashboardMetrics
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <Loader2 className="h-4 w-4 animate-spin" />
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Active Orders",
      value: data?.activeOrders || 0,
      change: data?.orderChange || 0,
    },
    {
      title: "Today's Deliveries",
      value: data?.todayDeliveries || 0,
      change: data?.deliveryChange || 0,
    },
    {
      title: "Pending Payments",
      value: data?.pendingPayments ? `$${data.pendingPayments.toLocaleString()}` : "$0",
      change: data?.paymentChange || 0,
    },
    {
      title: "Active Clients",
      value: data?.activeClients || 0,
      change: data?.clientChange || 0,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="p-6">
          <div className="flex flex-col space-y-1">
            <p className="text-sm text-muted-foreground">{metric.title}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">{metric.value}</h3>
              <span
                className={`text-sm flex items-center gap-1 ${
                  metric.change >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {metric.change >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {Math.abs(metric.change)}%
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
