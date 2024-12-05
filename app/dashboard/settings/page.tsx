'use client'

import { Separator } from '@/components/ui/separator'
import { IconUser, IconBriefcase } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Layout } from '@/components/custom/layout'

export default function SettingsPage() {
  const router = useRouter()

  const settingsOptions = [
    {
      title: "Profile Settings",
      description: "Manage your personal information, email, and account preferences",
      icon: <IconUser className="h-6 w-6" />,
      href: "/dashboard/settings/profile"
    },
    {
      title: "Business Settings",
      description: "Update your business details, logo, contact information, and more",
      icon: <IconBriefcase className="h-6 w-6" />,
      href: "/dashboard/settings/business"
    }
  ]

  return (
    <Layout>
      <div className="space-y-6 p-6 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account and business settings
          </p>
        </div>
        <Separator />
        <div className="grid gap-6 md:grid-cols-2">
          {settingsOptions.map((option) => (
            <Button
              key={option.href}
              variant="outline"
              className="flex h-auto flex-col items-start gap-2 p-6 text-left"
              onClick={() => router.push(option.href)}
            >
              <div className="flex items-center gap-2">
                {option.icon}
                <h3 className="font-semibold">{option.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </Button>
          ))}
        </div>
      </div>
    </Layout>
  )
}
