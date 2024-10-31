// src/components/login-form.tsx

"use client";

import { HTMLAttributes, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/custom/button";
import { PasswordInput } from "@/components/custom/password-input";
import { useAuth } from "@/contexts/auth-context";
import { loginAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Please enter your password" }),
});

// Define form values type based on the Zod schema
type FormValues = z.infer<typeof formSchema>;

export function LoginForm({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState(false);
  const { closeAuth, redirectPath,openAuth } = useAuth();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const result = await loginAction({
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        closeAuth();
        if (redirectPath) {
          router.push(redirectPath);
        } else {
          router.push("/dashboard");
        }
      } else {
        form.setError("root", {
          message: result.message || "Login failed",
        });
      }
    } catch (error) {
      console.error(error);
      form.setError("root", {
        message: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <p className="text-sm text-red-500">
                {form.formState.errors.root.message}
              </p>
            )}
            <Button className="mt-2" loading={isLoading}>
              Sign In
            </Button>
          </div>
        </form>
      </Form>
      <Button
        variant="link"
        className="px-0 font-normal"
        onClick={() => openAuth("forgot-password")}
      >
        Forgot password?
      </Button>
    </div>
  );
}
