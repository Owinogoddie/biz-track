// src/components/forgot-password/reset-complete.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import { CheckCircleIcon } from 'lucide-react'

export function ResetComplete() {
  const { openAuth } = useAuth()

  return (
    <div className="text-center space-y-4">
      <div className="mb-4">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
      </div>
      <h3 className="text-lg font-medium">Password Reset Complete</h3>
      <p className="text-sm text-muted-foreground">
        Your password has been successfully reset.
        You can now sign in with your new password.
      </p>
      <Button
        onClick={() => openAuth('login')}
        className="w-full"
      >
        Sign In
      </Button>
    </div>
  )
}