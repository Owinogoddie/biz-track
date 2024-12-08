import { getRecentActivities } from "@/app/actions/distributionReport/dashboard";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export function RecentActivities({ className = "" }: { className?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: getRecentActivities
  });

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`}>
        <h3 className="font-semibold mb-4">Recent Activities</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {data?.activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <div>
              <p className="font-medium">{activity.description}</p>
              <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
            </div>
            <span
              className={`text-sm px-2 py-1 rounded-full ${
                activity.type === "order"
                  ? "bg-blue-100 text-blue-700"
                  : activity.type === "delivery"
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {activity.type}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}