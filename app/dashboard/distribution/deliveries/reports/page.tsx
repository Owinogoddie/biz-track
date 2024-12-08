import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from './_components/date-range-picker';
import { OverviewMetrics } from './_components/overview-metrics';
import { DeliveryPerformance } from './_components/delivery-performance';
import { FinancialMetrics } from './_components/financial-metrics';
import { ClientSatisfaction } from './_components/client-satisfaction';

const Reports = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Distribution Reports</h1>
          <p className="text-muted-foreground">
            Analyze your distribution performance and metrics
          </p>
        </div>
        <DateRangePicker date={dateRange} setDate={setDateRange} />
      </div>

      <OverviewMetrics dateRange={dateRange} />

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Delivery Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial Metrics</TabsTrigger>
          <TabsTrigger value="satisfaction">Client Satisfaction</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4">
          <DeliveryPerformance dateRange={dateRange} />
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <FinancialMetrics dateRange={dateRange} />
        </TabsContent>
        
        <TabsContent value="satisfaction" className="space-y-4">
          <ClientSatisfaction dateRange={dateRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;