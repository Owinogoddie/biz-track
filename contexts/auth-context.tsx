// @/contexts/auth-context.tsx
'use client'

import { createContext, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'

type AuthStep = 'signup' | 'login' | 'otp' | 'complete' |'forgot-password'

interface AuthContextType {
  isModalOpen: boolean
  currentStep: AuthStep
  openAuth: (step: AuthStep, redirectTo?: string) => void
  closeAuth: () => void
  nextStep: () => void
  email: string
  setEmail: (email: string) => void
  redirectPath: string | null
  setRedirectPath: (path: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<AuthStep>('signup')
  const [email, setEmail] = useState('')
  const [redirectPath, setRedirectPath] = useState<string | null>(null)
  const router = useRouter()

  const openAuth = (step: AuthStep, redirectTo?: string) => {
    setCurrentStep(step)
    setIsModalOpen(true)
    if (redirectTo) setRedirectPath(redirectTo)
    // if (redirectTo) setRedirectPath(redirectTo)
    // window.history.pushState({}, '', `/${step}`)
  }

  const closeAuth = () => {
    setIsModalOpen(false)
    setCurrentStep('signup')
    setEmail('')
    setRedirectPath(null)
  }

  const nextStep = () => {
    const steps: AuthStep[] = ['signup', 'otp', 'complete']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    } else {
      closeAuth()
      if (redirectPath) {
        router.push(redirectPath)
      } else {
        router.push('/dashboard')
      }
    }
  }

  return (
    <AuthContext.Provider value={{ 
      isModalOpen, 
      currentStep, 
      openAuth, 
      closeAuth, 
      nextStep,
      email,
      setEmail,
      redirectPath,
      setRedirectPath
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}