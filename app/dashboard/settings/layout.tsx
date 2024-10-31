'use client'

import { Layout } from '@/components/custom/layout'
import { Separator } from '@/components/ui/separator'
import SidebarNav from './_components/sidebar-nav'
import {
  IconBrowserCheck,
  IconExclamationCircle,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from '@tabler/icons-react'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Layout fixed>
      {/* ===== Top Header Section ===== */}
      {/* <Layout.Header>
        <div className="flex w-full items-center justify-between">
          <Search />
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </Layout.Header> */}

      {/* ===== Main Content Section ===== */}
      <Layout.Body className="flex flex-col">
        {/* Page Title and Description */}
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
        </div>

        <Separator className="my-4 lg:my-6" />

        {/* Sidebar and Main Content */}
        <div className="flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0">
          {/* Sidebar Navigation */}
          <aside className="top-0 lg:sticky lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>

          {/* Nested Content */}
          <div className="flex w-full p-1 pr-4 md:overflow-y-hidden">
            {children}
          </div>
        </div>
      </Layout.Body>
    </Layout>
  )
}

// Sidebar Navigation Items
const sidebarNavItems = [
  {
    title: 'Profile',
    icon: <IconUser size={18} />,
    href: '/dashboard/settings',
  },
  {
    title: 'Account',
    icon: <IconTool size={18} />,
    href: '/dashboard/settings/account',
  },
  {
    title: 'Appearance',
    icon: <IconPalette size={18} />,
    href: '/dashboard/settings/appearance',
  },
  {
    title: 'Notifications',
    icon: <IconNotification size={18} />,
    href: '/dashboard/settings/notifications',
  },
  {
    title: 'Display',
    icon: <IconBrowserCheck size={18} />,
    href: '/dashboard/settings/display',
  },
  {
    title: 'Error Example',
    icon: <IconExclamationCircle size={18} />,
    href: '/settings/error-example',
  },
]
