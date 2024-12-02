import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context";
import { AuthModal } from "@/components/modals/auth-modal";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "BizTrack - Business Management Platform",
  description: "BizTrack helps businesses of all sizes manage their inventory, track services, and gain financial insights. Multiple accounts, multiple businesses, all in one powerful platform.",
  authors: [{ name: "BizTrack" }],
  openGraph: {
    title: "BizTrack - Business Management Platform",
    description: "BizTrack helps businesses of all sizes manage their inventory, track services, and gain financial insights. Multiple accounts, multiple businesses, all in one powerful platform.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BizTrack - Business Management Platform",
    description: "BizTrack helps businesses of all sizes manage their inventory, track services, and gain financial insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head />
    <body  className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
         <AuthProvider>
          <AuthModal />
          {children}
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </body>
  </html>
  );
}
