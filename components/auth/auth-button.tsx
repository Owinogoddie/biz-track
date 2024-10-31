//components/auth-button.tsx
'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

export function AuthButton() {
  const { openAuth } = useAuth()

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={() => openAuth('login')}
      >
        Login
      </Button>
      <Button 
        onClick={() => openAuth('signup')}
      >
        Sign Up
      </Button>
    </div>
  )
}