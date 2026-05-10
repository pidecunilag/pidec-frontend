"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { loginSchema, type LoginFormValues } from "@/lib/validators/auth";
import { useAuth } from "@/lib/hooks/use-auth";
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
import { PasswordInput } from "@/components/ui/password-input";

export function LoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, user, isLoading: isAuthLoading } = useAuth();

  const [persistedData, setPersistedData, clearStorage] = useLocalStorageState<
    Partial<LoginFormValues>
  >("pidec_login_form", { email: "", password: "" });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: persistedData.email || "",
      password: persistedData.password || "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setPersistedData((prev) => ({ ...prev, ...value }));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setPersistedData]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") router.push("/admin");
      else if (user.role === "judge") router.push("/judge");
      else router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      clearStorage();
      toast.success("Welcome back!");
    } catch (error: unknown) {
      const apiError = extractApiError(error);
      toast.error(
        apiError.message || "Failed to sign in. Please check your credentials.",
      );
    }
  };

  const isSubmitting = form.formState.isSubmitting || isAuthLoading;

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-cyan)]">
          Welcome Back
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
          Sign in to PIDEC 1.0
        </h1>
        <p className="max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
          Continue to your dashboard, manage your team, and keep track of
          submissions with a cleaner PIDEC experience.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-plum-soft)]">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      className="h-14 rounded-2xl border-[rgba(42,0,59,0.1)] bg-white/90 px-4 text-base shadow-[0_10px_24px_rgba(42,0,59,0.05)]"
                      type="email"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between gap-4">
                    <FormLabel className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-plum-soft)]">
                      Password
                    </FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-semibold text-[var(--brand-purple)] transition-colors hover:text-[var(--brand-pink)]"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter your password"
                      className="h-14 rounded-2xl border-[rgba(42,0,59,0.1)] bg-white/90 px-4 text-base shadow-[0_10px_24px_rgba(42,0,59,0.05)]"
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
            className="h-14 w-full rounded-full border-0 bg-[linear-gradient(135deg,#6d2dff_0%,#8e4dff_48%,#b57cff_100%)] bg-[length:145%_145%] text-base font-semibold text-white shadow-[0_18px_34px_rgba(109,45,255,0.24)] hover:bg-[position:100%_50%] hover:shadow-[0_22px_42px_rgba(109,45,255,0.3)]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      <div className="rounded-[1.5rem] border border-[rgba(42,0,59,0.08)] bg-[linear-gradient(135deg,rgba(18,183,234,0.08)_0%,rgba(142,77,255,0.08)_100%)] px-5 py-4 text-sm text-[var(--brand-plum-soft)]">
        New to PIDEC?{" "}
        <Link
          href="/register"
          className="font-semibold text-[var(--brand-purple)] transition-colors hover:text-[var(--brand-pink)]"
        >
          Create your account
        </Link>
      </div>
    </div>
  );
}
