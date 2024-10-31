'use client'

import { useRouter } from 'next/navigation'
import { logoutAction } from '@/app/actions/auth'
import { useState } from 'react'
import { Button } from '../custom/button'

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const result = await logoutAction()
      
      if (result.success) {
        // Redirect to login page or home page
        router.push('/login')
        router.refresh() // Refresh to update server-side rendering
      } else {
        // Handle logout error (maybe show a toast or error message)
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
    size='sm'
      onClick={handleLogout} 
      disabled={isLoading}
      className="bg-red-500"
      loading={isLoading}
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}