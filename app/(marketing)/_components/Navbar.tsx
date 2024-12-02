'use client'
import { AuthButton } from "@/components/auth/auth-button";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";

const navigation = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl">
            BizTrack<span className="text-primary">Pro</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              {user && (
                <Link href="/dashboard">
                  <Button variant="outline" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <AuthButton />
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="flex flex-col space-y-4 pt-4 border-t">
                    {user && (
                      <Link href="/dashboard">
                        <Button variant="outline" className="w-full gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <AuthButton />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}