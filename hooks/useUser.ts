import { useState, useEffect } from 'react'
import { getUserAction } from '@/app/actions/auth'

type User = {
  id: string
  name: string | null
  email: string
  picture: string | null
  emailVerified: boolean
  role: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function fetchUser() {
    try {
      const response = await getUserAction()
      
      if (response.success && response.user) {
        setUser(response.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return { 
    user, 
    isLoading,
    mutate: fetchUser
  }
}