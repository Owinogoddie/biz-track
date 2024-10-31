interface AuthResponse<T = unknown> {
    success: boolean;
    error?: string;
    data?: T;
  }
  
  // Simulate network delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  export async function simulateSignup(data: { email: string; password: string }): Promise<AuthResponse<{ email: string; otpSent: boolean }>> {
    await delay(1500); // Simulate API call
  
    if (!data.email.includes('@')) {
      return { success: false, error: 'Invalid email format' };
    }
  
    return {
      success: true,
      data: {
        email: data.email,
        otpSent: true
      }
    };
  }
  
  export async function simulateOtpVerification(otp: string): Promise<AuthResponse<{ verified: boolean }>> {
    await delay(1000);
  
    if (!/^\d{6}$/.test(otp)) {
      return { success: false, error: 'Invalid OTP format' };
    }
  
    return {
      success: true,
      data: {
        verified: true
      }
    };
  }
  
  export async function simulateLogin(data: { email: string; password: string }): Promise<AuthResponse<{ user: { email: string; name: string }; token: string }>> {
    await delay(1000);
  
    return {
      success: true,
      data: {
        user: {
          email: data.email,
          name: 'Test User'
        },
        token: 'fake-jwt-token'
      }
    };
  }
  
  export async function simulateRequestPasswordReset(email: string): Promise<AuthResponse<{ otpSent: boolean }>> {
    await delay(1000);
  
    if (!email.includes('@')) {
      return { success: false, error: 'Invalid email format' };
    }
  
    return {
      success: true,
      data: {
        otpSent: true
      }
    };
  }
  
  export async function simulateResetPassword(data: { token: string; newPassword: string }): Promise<AuthResponse<{ passwordReset: boolean }>> {
    await delay(1000);
    console.log(data);
    return {
      success: true,
      data: {
        passwordReset: true
      }
    };
  }
  