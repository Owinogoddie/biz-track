//components/auth/auth-button.tsx
"use client";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "../custom/button";
import { LogoutButton } from "./logout-button";
import { UserNav } from "./user-nav";

export function AuthButton() {
  const { openAuth } = useAuth();
  const { user, isLoading } = useUser();

  // if (isLoading) {
  //   return <div>Loading...</div>
  // }

  // if (!user) {
  //   return <div>Not authenticated</div>
  // }
  return (
    <div className="flex gap-2">
      {!user ? (
        <>
          <Button
            variant="outline"
            onClick={() => openAuth("login")}
            loading={isLoading}
          >
            Login
          </Button>
          <Button onClick={() => openAuth("signup")} loading={isLoading}>
            Sign Up
          </Button>
        </>
      ) : (
        <>
        {/* <p>Logged in as {user?.email}</p> */}
        <UserNav/>
        {/* <LogoutButton/> */}
        </>
      )}
    </div>
  );
}
