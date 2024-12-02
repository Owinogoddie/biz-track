'use client';
import { useEffect, useMemo, useState } from 'react';
import { Package, Users, Layers, Activity, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from './_components/stats-card';
import { ProductionChart } from './_components/production-chart';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useBusinessStore } from '@/store/useBusinessStore';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { Analytics } from './_components/analytics';
import { Reports } from './_components/reports';
import { LoadingScreen } from '@/components/loading-screen';

const DashboardPage = () => {
  const { currentBusiness } = useBusinessStore();
  const { products, productions, employees, categories, isLoading } = useDashboardData(currentBusiness?.id || '');
  const [currency, setCurrency] = useState('KES');

  const productionData = useMemo(() => {
    const last30Days = [...Array(30)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toISOString().split('T')[0],
        count: 0
      };
    }).reverse();

    productions.forEach((prod: any) => {
      const date = new Date(prod.startDate).toISOString().split('T')[0];
      const dayData = last30Days.find(d => d.date === date);
      if (dayData) {
        dayData.count++;
      }
    });

    return last30Days;
  }, [productions]);

  if (isLoading) {
    return <div><LoadingScreen/> </div>;
  }

  const totalValue = products.reduce((sum: number, product: any) => 
    sum + (product.price * product.quantity), 0
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Products"
              value={formatNumber(products.length)}
              icon={Package}
              description="Active products in inventory"
            />
            <StatsCard
              title="Total Employees"
              value={formatNumber(employees.length)}
              icon={Users}
              description="Current team members"
            />
            <StatsCard
              title="Categories"
              value={formatNumber(categories.length)}
              icon={Layers}
              description="Product categories"
            />
            <StatsCard
              title="Inventory Value"
              value={formatCurrency(totalValue, currency)}
              icon={DollarSign}
              description="Total value of current stock"
            />
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            <ProductionChart 
              data={productionData}
              className="col-span-4"
            />
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Productions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {productions.slice(0, 5).map((production: any) => (
                    <div key={production.id} className="flex items-center">
                      <Activity className="h-4 w-4 mr-4 text-muted-foreground" />
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {production.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Batch: {production.batchNumber}
                        </p>
                      </div>
                      <div className="ml-auto text-sm text-muted-foreground">
                        {new Date(production.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>

        <TabsContent value="reports">
          <Reports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;