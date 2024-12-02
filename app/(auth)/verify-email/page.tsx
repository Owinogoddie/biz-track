"use client"
import { Suspense } from 'react'
import VerifyEmailContent from './verify-email-content'
import { LoadingScreen } from '@/components/loading-screen'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div><LoadingScreen/> </div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}