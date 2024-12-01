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
import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { getBusinesses } from '../actions/business'
import { useRouter } from 'next/navigation'
import { LoadingScreen } from '@/components/loading-screen'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const { hasBusiness, setHasBusiness, setBusinesses, setCurrentBusiness } = useBusinessStore();
  const { user, isLoading } = useUser();
  const [showDebug, setShowDebug] = useState(false);
  const [forceShowModal, setForceShowModal] = useState(false);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    const loadBusinesses = async () => {
      if (!user) return;
      
      try {
        const result = await getBusinesses();
        console.log("Businesses loaded:", result);
        if (result.success) {
          setBusinesses(result.businesses);
          setHasBusiness(result.businesses.length > 0);
          if (result.businesses.length > 0) {
            setCurrentBusiness(result.businesses[0]);
          }
        }
      } finally {
        setIsLoadingBusinesses(false);
      }
    };
    
    if (!isLoading) {
      loadBusinesses();
    }
  }, [user, isLoading, setHasBusiness, setBusinesses, setCurrentBusiness, router]);

  if (isLoading || isLoadingBusinesses) {
    return <LoadingScreen />;
  }

  // If no user, show nothing (redirect happens in useEffect)
  if (!user) {
    return null;
  }
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
                {/* <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowDebug(!showDebug)}
                >
                  Toggle Debug
                </Button> */}
                {/* <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setForceShowModal(true)}
                >
                  Show Business Modal
                </Button> */}
                <ThemeToggle />
                <UserNav />
              </div>
            </div>
          </Layout.Header>

          <Layout.Body>
            {showDebug && (
              <div className="p-4 bg-muted rounded-lg mb-4 text-left">
                <p>User Loading: {String(isLoading)}</p>
                <p>Has User: {String(!!user)}</p>
                <p>User ID: {user?.id}</p>
                <p>Has Business: {String(hasBusiness)}</p>
              </div>
            )}
            {(!isLoading && !hasBusiness && user || forceShowModal) && (
              <CreateBusinessModal 
                userId={user?.id || ''} 
                onClose={() => setForceShowModal(false)}
              />
            )}
            {children}
          </Layout.Body>
        </Layout>
      </main>
    </div>
  )
}