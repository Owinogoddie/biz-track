import { useEffect, useState } from 'react'
import { getProducts } from '@/app/actions/product'
import { getProductions } from '@/app/actions/production'
import { getBusinessUsers } from '@/app/actions/business-user'
import { getCategories } from '@/app/actions/category'

interface DashboardData {
  products: any[]
  productions: any[]
  employees: any[]
  categories: any[]
  isLoading: boolean
  error?: string
}

export const useDashboardData = (businessId: string) => {
  const [data, setData] = useState<DashboardData>({
    products: [],
    productions: [],
    employees: [],
    categories: [],
    isLoading: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) {
        setData(prev => ({ ...prev, isLoading: false, error: 'No business ID provided' }))
        return
      }

      try {
        setData(prev => ({ ...prev, isLoading: true }))
        
        const [
          productsRes,
          productionsRes,
          employeesRes,
          categoriesRes,
        ] = await Promise.all([
          getProducts(businessId),
          getProductions(businessId),
          getBusinessUsers(businessId),
          getCategories(businessId),
        ])

        setData({
          products: productsRes.success ? productsRes.products : [],
          productions: productionsRes.success ? productionsRes.productions : [],
          employees: employeesRes.success ? employeesRes.employees : [],
          categories: categoriesRes.success ? categoriesRes.categories : [],
          isLoading: false,
        })
      } catch (error) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to fetch dashboard data'
        }))
      }
    }

    fetchData()
  }, [businessId])

  return data
}