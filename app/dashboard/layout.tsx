'use client'

import { Search } from '@/components/search'
import { UserNav } from '@/components/user-nav'
import Sidebar from '@/components/sidebar'
import SkipToMain from '@/components/skip-to-main'
import useIsCollapsed from '@/hooks/useIsCollapsed'
import { Layout } from '@/components/custom/layout'
import { ThemeToggle } from '@/components/theme-switch'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

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
            {children}
          </Layout.Body>
        </Layout>
      </main>
    </div>
  )
}