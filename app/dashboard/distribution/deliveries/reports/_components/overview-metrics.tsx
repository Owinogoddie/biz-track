import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getOverviewMetrics } from "../actions/reports";
import { Loader2 } from "lucide-react";

interface OverviewMetricsProps {
  dateRange: { from: Date; to: Date };
}

export function OverviewMetrics({ dateRange }: OverviewMetricsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['overview-metrics', dateRange],
    queryFn: () => getOverviewMetrics(dateRange),
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Deliveries",
      value: data?.totalDeliveries || 0,
      change: "+12.3%",
      changeType: "positive" as const,
    },
    {
      title: "On-Time Rate",
      value: data?.onTimeRate ? `${data.onTimeRate}%` : "0%",
      change: "-2.1%",
      changeType: "negative" as const,
    },
    {
      title: "Revenue",
      value: data?.revenue ? `$${data.revenue.toLocaleString()}` : "$0",
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      title: "Active Clients",
      value: data?.activeClients || 0,
      change: "+3.1%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="p-6">
          <div className="flex flex-col space-y-1">
            <p className="text-sm text-muted-foreground">{metric.title}</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">{metric.value}</h3>
              <span
                className={`text-sm ${
                  metric.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {metric.change}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}