'use client'

import { Search } from '@/components/search'
import { UserNav } from '@/components/auth/user-nav'
import Sidebar from '@/components/sidebar'
import SkipToMain from '@/components/skip-to-main'
import useIsCollapsed from '@/hooks/useIsCollapsed'
import { Layout } from '@/components/custom/layout'
import { ThemeToggle } from '@/components/theme-switch'
import { CreateBusinessModal } from '@/components/modals/create-business-modal'
import { useBusinessStore } from '@/store/useBusinessStore'
import { useEffect } from 'react'
import { useUser } from '@/hooks/useUser'
import { getBusinesses } from '../actions/business'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  const { hasBusiness, setHasBusiness, setBusinesses, setCurrentBusiness } = useBusinessStore()
  const { user, isLoading } = useUser()

  useEffect(() => {
    const loadBusinesses = async () => {
      if (!user) return
      
      const result = await getBusinesses(user.id)
      if (result.success) {
        setBusinesses(result.businesses)
        setHasBusiness(result.businesses.length > 0)
        if (result.businesses.length > 0) {
          setCurrentBusiness(result.businesses[0])
        }
      }
    }
    
    if (!isLoading) {
      loadBusinesses()
    }
  }, [user, isLoading, setHasBusiness, setBusinesses, setCurrentBusiness])

  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <SkipToMain />
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <Layout fixed>
          <Layout.Header>
            <div className='flex w-full items-center justify-between'>
              <Search />
              <div className='flex items-center space-x-4'>
                <ThemeToggle />
                <UserNav />
              </div>
            </div>
          </Layout.Header>

          <Layout.Body>
            {!isLoading && !hasBusiness && user && (
              <CreateBusinessModal userId={user.id} />
            )}
            {children}
          </Layout.Body>
        </Layout>
      </main>
    </div>
  )
}