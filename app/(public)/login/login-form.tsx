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

export function LoginForm() {
  const router = useRouter();
  const { login, isAuthenticated, user, isLoading: isAuthLoading } = useAuth();

  const [persistedData, setPersistedData, clearStorage] = useLocalStorageState<Partial<LoginFormValues>>(
    "pidec_login_form",
    { email: "", password: "" }
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: persistedData.email || "",
      password: persistedData.password || "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value: any) => {
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
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in. Please check your credentials.");
    }
  };

  const isSubmitting = form.formState.isSubmitting || isAuthLoading;

  return (
    <div className="w-full max-w-md mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="text-muted-foreground text-lg">
          Log in to your PIDEC account to manage your team and submissions.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base">Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-brand hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
