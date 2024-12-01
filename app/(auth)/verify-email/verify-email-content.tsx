"use client"
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyEmailAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export default function VerifyEmailContent() {
  const [isVerifying, setIsVerifying] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const verifyEmail = async () => {
      const code = searchParams.get('code')
      const email = searchParams.get('email')

      if (!code || !email) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Invalid verification link',
        })
        setIsVerifying(false)
        return
      }

      const result = await verifyEmailAction({ email, code })
      
      if (result.success) {
        toast({
          title: 'Email verified',
          description: 'You can now log in to your account',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.message || 'Failed to verify email',
        })
      }
      setIsVerifying(false)
    }

    verifyEmail()
  }, [searchParams, toast])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        {isVerifying ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Verifying your email...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Email Verification
            </h1>
            <Button onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}