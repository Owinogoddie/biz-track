'use client'

import { useEffect, useState } from 'react'
import ContentSection from "../_components/content-section"
import { BusinessForm } from "./business-form"
import { getBusinessAction } from "@/app/actions/settings"
import { toast } from "@/hooks/use-toast"
import { useBusinessStore } from '@/store/useBusinessStore'
import { Business } from '@/types/business'

export default function BusinessPage() {
  const [businessData, setBusinessData] = useState<Business | null>(null)
  const { currentBusiness } = useBusinessStore()

  useEffect(() => {
    const fetchBusiness = async () => {
      if (currentBusiness) {
        const result = await getBusinessAction(currentBusiness.id)
        if (result.success) {
          setBusinessData(result.business)
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          })
        }
      }
    }
    
    fetchBusiness()
  }, [currentBusiness])

  if (!currentBusiness) {
    return (
      <ContentSection
        title="Business Settings"
        desc="Manage your business information and branding."
      >
        <div>No business selected</div>
      </ContentSection>
    )
  }

  return (
    <ContentSection
      title="Business Settings"
      desc="Manage your business information and branding."
    >
      <BusinessForm businessId={currentBusiness.id} initialData={businessData} />
    </ContentSection>
  )
}