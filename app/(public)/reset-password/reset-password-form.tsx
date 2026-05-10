"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ShieldCheck, TriangleAlert } from "lucide-react";

import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validators/auth";
import { authApi } from "@/lib/api/auth";
import { useLocalStorageState } from "@/lib/hooks/use-local-storage";
import { extractApiError } from "@/lib/api/client";
import { qk } from "@/lib/api/query-keys";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { User } from "@/lib/types";
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
import { PasswordInput } from "@/components/ui/password-input";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const token = searchParams.get("token");
  const isJudgeInvite = searchParams.get("invite") === "judge";

  const [isSuccess, setIsSuccess] = useState(false);

  const [persistedData, setPersistedData, clearStorage] = useLocalStorageState<Partial<ResetPasswordFormValues>>(
    "pidec_reset_password_form",
    { password: "", confirmPassword: "" }
  );

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      password: persistedData.password || "",
      confirmPassword: persistedData.confirmPassword || "",
    },
  });

  const passwordValue = form.watch("password");

  useEffect(() => {
    const subscription = form.watch((value) => {
      setPersistedData((prev) => ({ ...prev, password: value.password, confirmPassword: value.confirmPassword }));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setPersistedData]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const result = await authApi.resetPassword({
        token: data.token,
        password: data.password,
      });
      clearStorage();
      toast.success(isJudgeInvite ? "Judge account ready!" : "Password reset successfully!");

      if (result.isAuthenticated) {
        const me = result.user;
        queryClient.setQueryData<User>(qk.me, me);
        setUser(me);
        if (me.role === "judge") {
          router.replace("/judge");
          return;
        }
        if (me.role === "admin") {
          router.replace("/admin");
          return;
        }
        router.replace("/dashboard");
        return;
      }

      setIsSuccess(true);
    } catch (error: unknown) {
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
          {isJudgeInvite ? "Judge Account Ready" : "Password Updated"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isJudgeInvite
            ? "Your password is set. You can now sign in to continue to your judge dashboard."
            : "Your password has been successfully reset. You can now use your new password to sign in."}
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
          {isJudgeInvite ? "Set Your Judge Password" : "Create New Password"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isJudgeInvite
            ? "Create a secure password to activate your judge access and open your dashboard."
            : "Please enter your new password below. Make sure it&apos;s strong and unique."}
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
                    <PasswordInput
                      placeholder="••••••••"
                      className="h-12 text-base"
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
                    <PasswordInput
                      placeholder="••••••••"
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
              isJudgeInvite ? "Set Password" : "Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export function ResetPasswordFallback() {
  return (
    <div className="w-full max-w-md mx-auto py-12 space-y-6 flex flex-col items-center text-center">
      <Loader2 className="h-12 w-12 animate-spin text-brand" />
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Loading...
      </h1>
    </div>
  );
}
