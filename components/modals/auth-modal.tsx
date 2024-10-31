// src/components/auth-modal.tsx
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";
import { LoginForm } from "../auth/login-form";
import { SignUpForm } from "../auth/sign-up-form";
import { OtpForm } from "../auth/otp-form";
import { ForgotPasswordFlow } from "../auth/forgot-password/forgot-password-flow";
import { Button } from "../ui/button";
export function AuthModal() {
  const { isModalOpen, closeAuth, openAuth, currentStep, email } = useAuth();

  const getStepContent = () => {
    switch (currentStep) {
      case "login":
        return (
          <>
            <div className="mb-4 flex flex-col space-y-2 text-center">
              <h1 className="text-lg font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>
            <LoginForm />
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">
                Dont have an account?{" "}
              </span>
              <button
                className="text-primary hover:underline"
                onClick={() => openAuth("signup")}
              >
                Sign up
              </button>
            </div>
          </>
        );
      case "signup":
        return (
          <>
            <div className="mb-4 flex flex-col space-y-2 text-center">
              <h1 className="text-lg font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and password to create an account.
              </p>
            </div>
            <SignUpForm />
          </>
        );
      case "otp":
        return (
          <>
            <div className="mb-4 flex flex-col space-y-2 text-center">
              <h1 className="text-lg font-semibold tracking-tight">
                Verify your email
              </h1>
              <p className="text-sm text-muted-foreground">
                We sent a verification code to {email}
              </p>
            </div>
            <OtpForm />
          </>
        );
      case "complete":
        return (
          <div className="text-center">
            <h1 className="text-lg font-semibold">Almost there!</h1>
            <p className="text-sm text-muted-foreground">
              Your account has been created successfully.
            </p>
            <Button onClick={() => openAuth("login")}>
              Login to Your Account
            </Button>
          </div>
        );
      case "forgot-password":
        return (
          <>
            <div className="mb-4 flex flex-col space-y-2 text-center">
              <h1 className="text-lg font-semibold tracking-tight">
                Reset Your Password
              </h1>
              <p className="text-sm text-muted-foreground">
                Follow the steps to reset your password
              </p>
            </div>
            <ForgotPasswordFlow />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeAuth}>
      <DialogContent className="sm:max-w-[425px]">
        {getStepContent()}
      </DialogContent>
    </Dialog>
  );
}
