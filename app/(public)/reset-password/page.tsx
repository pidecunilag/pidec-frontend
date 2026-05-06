"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ShieldCheck, TriangleAlert } from "lucide-react";

import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validators/auth";
import { authApi } from "@/lib/api/auth";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage";
import { extractApiError } from "@/lib/api/client";
import { PasswordStrength } from "@/components/auth/PasswordStrength";

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

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [isSuccess, setIsSuccess] = useState(false);

  // Persist form inputs in localStorage
  const [persistedData, setPersistedData, clearStorage] = useLocalStorageState<Partial<ResetPasswordFormValues>>(
    "pidec_reset_password_form",
    { password: "", confirmPassword: "" }
  );

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema) as any,
    defaultValues: {
      token: token || "", // Hidden field
      password: persistedData.password || "",
      confirmPassword: persistedData.confirmPassword || "",
    },
  });

  const passwordValue = form.watch("password");

  // Watch form changes to sync with local storage
  useEffect(() => {
    const subscription = form.watch((value: any) => {
      setPersistedData((prev) => ({ ...prev, password: value.password, confirmPassword: value.confirmPassword }));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setPersistedData]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await authApi.resetPassword({
        token: data.token,
        password: data.password,
      });
      clearStorage();
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error: any) {
      const apiError = extractApiError(error);
      toast.error(apiError.message || "Failed to reset password. The link might be expired.");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center animate-in fade-in duration-500">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <TriangleAlert className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Invalid Reset Link
        </h1>
        <p className="text-muted-foreground text-lg">
          This password reset link is invalid or missing the required security token.
        </p>
        <div className="pt-6">
          <Button asChild className="w-full h-12 text-base font-semibold">
            <Link href="/forgot-password">Request New Link</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center animate-in fade-in duration-500">
        <div className="mx-auto w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="h-8 w-8 text-brand" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Password Updated
        </h1>
        <p className="text-muted-foreground text-lg">
          Your password has been successfully reset. You can now use your new password to sign in.
        </p>
        <div className="pt-6">
          <Button asChild className="w-full h-12 text-base font-semibold">
            <Link href="/login">Continue to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Password
        </h1>
        <p className="text-muted-foreground text-lg">
          Please enter your new password below. Make sure it's strong and unique.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      className="h-12 text-base"
                      type="password"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <PasswordStrength password={passwordValue} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      className="h-12 text-base"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md mx-auto py-12 space-y-6 flex flex-col items-center text-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Loading...
        </h1>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
