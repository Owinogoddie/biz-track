import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Users, 
  Route, 
  Calendar, 
  ShoppingCart, 
  Truck, 
  CreditCard,
  Package,
  LineChart
} from "lucide-react";
import { DashboardMetrics } from "./_components/dashboard-metrics";
import { RecentActivities } from "./_components/recent-activities";
import { QuickActions } from "./_components/quick-actions";

const DistributionDashboard = () => {
  const navigate = useNavigate();

  const navigationCards = [
    {
      title: "Clients",
      description: "Manage your distribution clients",
      icon: Users,
      path: "/distribution/clients"
    },
    {
      title: "Routes",
      description: "Plan and optimize delivery routes",
      icon: Route,
      path: "/distribution/routes"
    },
    {
      title: "Schedules",
      description: "Manage delivery schedules",
      icon: Calendar,
      path: "/distribution/schedules"
    },
    {
      title: "Orders",
      description: "Track and manage orders",
      icon: ShoppingCart,
      path: "/distribution/orders"
    },
    {
      title: "Deliveries",
      description: "Monitor active deliveries",
      icon: Truck,
      path: "/distribution/deliveries"
    },
    {
      title: "Payments",
      description: "Track payments and collections",
      icon: CreditCard,
      path: "/distribution/payments"
    },
    {
      title: "Inventory",
      description: "Manage distribution stock",
      icon: Package,
      path: "/distribution/inventory"
    },
    {
      title: "Reports",
      description: "View analytics and metrics",
      icon: LineChart,
      path: "/distribution/reports"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Distribution Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your distribution operations
        </p>
      </div>

      <DashboardMetrics />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <QuickActions />
        <RecentActivities className="md:col-span-2 lg:col-span-2" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {navigationCards.map((card) => (
          <Card 
            key={card.title} 
            className="p-6 hover:bg-accent cursor-pointer transition-colors"
            onClick={() => navigate(card.path)}
          >
            <div className="flex items-center gap-4">
              <card.icon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DistributionDashboard;