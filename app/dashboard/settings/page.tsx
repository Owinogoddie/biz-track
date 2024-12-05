'use client'

import { Separator } from '@/components/ui/separator'
import { IconUser, IconBriefcase, IconTrash } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Layout } from '@/components/custom/layout'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { useBusinessStore } from '@/store/useBusinessStore'
import { deleteBusiness } from '@/app/actions/business'
import { toast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const router = useRouter()
  const { currentBusiness, setCurrentBusiness, setHasBusiness } = useBusinessStore()
  const [confirmBusinessName, setConfirmBusinessName] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleDeleteBusiness = async () => {
    if (!currentBusiness) return
    if (confirmBusinessName !== currentBusiness.name) {
      toast({
        title: "Error",
        description: "Business name doesn't match",
        variant: "destructive",
      })
      return
    }

    try {
      setIsDeleting(true)
      const result = await deleteBusiness(currentBusiness.id)
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Business deleted successfully",
        })
        setCurrentBusiness(null)
        setHasBusiness(false)
        router.push('/dashboard')
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete business",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

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

        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <IconTrash className="mr-2 h-4 w-4" />
                Delete Business
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4">
                  <p>
                    This action cannot be undone. This will permanently delete your
                    business account and all associated data, including:
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>All products and categories</li>
                    <li>All sales and transaction records</li>
                    <li>All customer and supplier information</li>
                    <li>All production records</li>
                    <li>All financial records and reports</li>
                  </ul>
                  <div className="space-y-2">
                    <p>
                      Please type <span className="font-semibold">{currentBusiness?.name}</span> to confirm.
                    </p>
                    <Input
                      value={confirmBusinessName}
                      onChange={(e) => setConfirmBusinessName(e.target.value)}
                      placeholder="Enter business name"
                      className="mt-2"
                    />
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteBusiness}
                  disabled={confirmBusinessName !== currentBusiness?.name || isDeleting}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete Business"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Layout>
  )
}