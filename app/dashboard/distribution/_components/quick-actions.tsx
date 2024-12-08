import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Truck, Route, Calendar } from "lucide-react";

export function QuickActions({ className = "" }: { className?: string }) {
  const navigate = useNavigate();

  const actions = [
    {
      label: "New Order",
      icon: Plus,
      onClick: () => navigate("/distribution/orders/new"),
    },
    {
      label: "Start Delivery",
      icon: Truck,
      onClick: () => navigate("/distribution/deliveries/new"),
    },
    {
      label: "Plan Route",
      icon: Route,
      onClick: () => navigate("/distribution/routes/new"),
    },
    {
      label: "Schedule Delivery",
      icon: Calendar,
      onClick: () => navigate("/distribution/schedules/new"),
    },
  ];

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2"
            onClick={action.onClick}
          >
            <action.icon className="h-5 w-5" />
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}