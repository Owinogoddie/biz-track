import { useEffect, useState } from 'react';
import { getExpenditures } from '@/app/actions/expenditure';
import { useBusinessStore } from '@/store/useBusinessStore';
import { getSales } from '@/app/actions/sale';

interface FinancialData {
  currentMonthSales: number;
  currentMonthExpenditures: number;
  previousMonthBalance: number;
  initialBalance: number;
  expenditures: any[];
  sales: any[];
  isLoading: boolean;
  error?: string;
}

export const useFinancialData = (businessId: string) => {
  const { currentBusiness } = useBusinessStore();
  const [data, setData] = useState<FinancialData>({
    currentMonthSales: 0,
    currentMonthExpenditures: 0,
    previousMonthBalance: 0,
    initialBalance: currentBusiness?.openingBalance || 0,
    expenditures: [],
    sales: [],
    isLoading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) {
        setData(prev => ({ ...prev, isLoading: false, error: 'No business ID provided' }));
        return;
      }

      try {
        setData(prev => ({ ...prev, isLoading: true }));
        
        const [expendituresRes, salesRes] = await Promise.all([
          getExpenditures(businessId),
          getSales(businessId)
        ]);

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Filter current month transactions
        const currentMonthSales = salesRes.success ? 
          salesRes.sales
            .filter((sale: any) => {
              const saleDate = new Date(sale.createdAt);
              return saleDate.getMonth() === currentMonth && 
                     saleDate.getFullYear() === currentYear;
            })
            .reduce((sum: number, sale: any) => sum + sale.total, 0) : 0;

        const currentMonthExpenditures = expendituresRes.success ?
          expendituresRes.expenditures
            .filter((exp: any) => {
              const expDate = new Date(exp.date);
              return expDate.getMonth() === currentMonth &&
                     expDate.getFullYear() === currentYear;
            })
            .reduce((sum: number, exp: any) => sum + exp.amount, 0) : 0;

        // Calculate previous month's balance
        const previousMonthSales = salesRes.success ?
          salesRes.sales
            .filter((sale: any) => {
              const saleDate = new Date(sale.createdAt);
              return saleDate.getMonth() === (currentMonth - 1) &&
                     saleDate.getFullYear() === currentYear;
            })
            .reduce((sum: number, sale: any) => sum + sale.total, 0) : 0;

        const previousMonthExpenditures = expendituresRes.success ?
          expendituresRes.expenditures
            .filter((exp: any) => {
              const expDate = new Date(exp.date);
              return expDate.getMonth() === (currentMonth - 1) &&
                     expDate.getFullYear() === currentYear;
            })
            .reduce((sum: number, exp: any) => sum + exp.amount, 0) : 0;

        setData({
          currentMonthSales,
          currentMonthExpenditures,
          previousMonthBalance: previousMonthSales - previousMonthExpenditures,
          initialBalance: currentBusiness?.openingBalance || 0,
          expenditures: expendituresRes.success ? expendituresRes.expenditures : [],
          sales: salesRes.success ? salesRes.sales : [],
          isLoading: false,
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to fetch financial data'
        }));
      }
    };

    fetchData();
  }, [businessId, currentBusiness?.openingBalance]);

  return data;
};