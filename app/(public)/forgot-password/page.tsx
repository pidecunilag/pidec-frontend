"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validators/auth";
import { authApi } from "@/lib/api/auth";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage";
import { extractApiError } from "@/lib/api/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Persist form inputs in localStorage
  const [persistedData, setPersistedData, clearStorage] = useLocalStorageState<Partial<ForgotPasswordFormValues>>(
    "pidec_forgot_password_form",
    { email: "" }
  );

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema) as any,
    defaultValues: {
      email: persistedData.email || "",
    },
  });

  // Watch form changes to sync with local storage
  useEffect(() => {
    const subscription = form.watch((value: any) => {
      setPersistedData((prev) => ({ ...prev, ...value }));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setPersistedData]);

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await authApi.forgotPassword({ email: data.email });
      clearStorage();
      setIsSuccess(true);
      toast.success("Reset link sent successfully!");
    } catch (error: any) {
      const apiError = extractApiError(error);
      toast.error(apiError.message || "Failed to send reset link. Please try again.");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Check your email
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We've sent a password reset link to <span className="font-medium text-foreground">{form.getValues().email}</span>. 
            Please check your inbox and spam folder.
          </p>
        </div>
        
        <Button asChild className="w-full h-12 text-base font-semibold">
          <Link href="/login">Return to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Reset Password
        </h1>
        <p className="text-muted-foreground text-lg">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    className="h-12 text-base"
                    type="email"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
            
            <Button asChild variant="outline" className="w-full h-12 text-base" disabled={isSubmitting}>
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
