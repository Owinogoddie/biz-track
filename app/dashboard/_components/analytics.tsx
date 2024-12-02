'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useBusinessStore } from "@/store/useBusinessStore";
import { formatCurrency } from "@/lib/formatters";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function Analytics() {
  const { currentBusiness } = useBusinessStore();
  const { products, productions, categories } = useDashboardData(currentBusiness?.id || '');

  // Product value distribution data
  const productValueData = products.map((product: any) => ({
    name: product.name,
    value: product.price * product.quantity,
  })).sort((a: any, b: any) => b.value - a.value).slice(0, 10);

  // Category distribution data
  const categoryData = categories.map((category: any) => {
    const categoryProducts = products.filter((product: any) => product.categoryId === category.id);
    const totalValue = categoryProducts.reduce((sum: number, product: any) => 
      sum + (product.price * product.quantity), 0
    );
    return {
      name: category.name,
      value: totalValue
    };
  });

  // Production status data
  const productionStatusData = [
    { name: 'Completed', value: productions.filter((p: any) => p.status === 'COMPLETED').length },
    { name: 'In Progress', value: productions.filter((p: any) => p.status === 'IN_PROGRESS').length },
    { name: 'Pending', value: productions.filter((p: any) => p.status === 'PENDING').length },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Product Value Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={productValueData}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Production Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={productionStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
              >
                {productionStatusData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Production Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={productions.slice(-30)}>
              <XAxis 
                dataKey="startDate" 
                angle={-45} 
                textAnchor="end" 
                height={70}
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
              <Line type="monotone" dataKey="quantity" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}