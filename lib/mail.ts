import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


export const sendVerificationEmail = async (to: string, code: string) => {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: "Verify your email",
      text: `Your verification code is: ${code}. This code will expire in 1 hour.`,
      html: `<p>Your verification code is: <strong>${code}</strong>. This code will expire in 1 hour.</p>`,
    });
  };
  export const sendEmployeeInviteEmail = async (to: string, code: string, tempPassword: string) => {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?code=${code}&email=${encodeURIComponent(to)}`;
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: "Welcome to the team!",
      text: `
        Welcome to the team! Here are your login credentials:
        
        Email: ${to}
        Temporary Password: ${tempPassword}
        
        Please click the following link to verify your email:
        ${verificationUrl}
        
        After verifying your email, you can log in and change your password.
        This verification link will expire in 10 minutes.
      `,
      html: `
        <h2>Welcome to the team!</h2>
        <p>Here are your login credentials:</p>
        <p><strong>Email:</strong> ${to}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Please click the following link to verify your email:</p>
        <p><a href="${verificationUrl}">Verify Email</a></p>
        <p>After verifying your email, you can log in and change your password.</p>
        <p>This verification link will expire in 10 minutes.</p>
      `,
    });
  };
  export function generateEmailVerificationToken(length: number = 6): string {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }