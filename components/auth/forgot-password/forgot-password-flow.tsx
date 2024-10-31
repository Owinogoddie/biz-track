'use client'

import { useState } from 'react'
import { RequestResetForm } from './request-reset-form'
import { NewPasswordForm } from './new-password-form'
import { ResetOtpForm } from './reset-otp-form'
import { ResetComplete } from './reset-complete'

type ResetStep = 'request' | 'otp' | 'newPassword' | 'complete'

export function ForgotPasswordFlow() {
  const [currentStep, setCurrentStep] = useState<ResetStep>('request')
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')

  const goToNextStep = (nextStep: ResetStep) => {
    setCurrentStep(nextStep)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'request':
        return (
          <RequestResetForm
            onSuccess={(email) => {
              setEmail(email)
              goToNextStep('otp')
            }}
          />
        )
      case 'otp':
        return (
          <ResetOtpForm
            email={email}
            onSuccess={(token) => {
              setResetToken(token)
              goToNextStep('newPassword')
            }}
          />
        )
      case 'newPassword':
        return (
          <NewPasswordForm
          email={email}
            token={resetToken}
            onSuccess={() => goToNextStep('complete')}
          />
        )
      case 'complete':
        return <ResetComplete />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {renderStep()}
    </div>
  )
}
