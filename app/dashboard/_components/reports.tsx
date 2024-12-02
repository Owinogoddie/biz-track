'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useBusinessStore } from "@/store/useBusinessStore";
import { formatCurrency, formatNumber } from "@/lib/formatters";

export function Reports() {
  const { currentBusiness } = useBusinessStore();
  const { products, productions, categories } = useDashboardData(currentBusiness?.id || '');

  // Calculate inventory summary
  const inventorySummary = categories.map((category: any) => {
    const categoryProducts = products.filter((product: any) => product.categoryId === category.id);
    const totalValue = categoryProducts.reduce((sum: number, product: any) => 
      sum + (product.price * product.quantity), 0
    );
    
    return {
      category: category.name,
      products: categoryProducts.length,
      totalValue,
      lowStock: categoryProducts.filter((p: any) => p.quantity <= p.minQuantity).length,
    };
  });

  // Calculate production summary
  const productionSummary = {
    total: productions.length,
    inProgress: productions.filter((p: any) => p.status === 'IN_PROGRESS').length,
    completed: productions.filter((p: any) => p.status === 'COMPLETED').length,
    pending: productions.filter((p: any) => p.status === 'PENDING').length,
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Inventory Report by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Low Stock Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventorySummary.map((item: any) => (
                <TableRow key={item.category}>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{formatNumber(item.products)}</TableCell>
                  <TableCell>{formatCurrency(item.totalValue)}</TableCell>
                  <TableCell>{formatNumber(item.lowStock)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Production Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="text-sm font-medium">Total Productions</h3>
              <p className="text-2xl font-bold">{formatNumber(productionSummary.total)}</p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="text-sm font-medium">In Progress</h3>
              <p className="text-2xl font-bold">{formatNumber(productionSummary.inProgress)}</p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="text-sm font-medium">Completed</h3>
              <p className="text-2xl font-bold">{formatNumber(productionSummary.completed)}</p>
            </div>
            <div className="p-4 bg-background rounded-lg border">
              <h3 className="text-sm font-medium">Pending</h3>
              <p className="text-2xl font-bold">{formatNumber(productionSummary.pending)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}