"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { registerSchema, type RegisterFormValues } from "@/lib/validators/auth";
import { DEPARTMENTS, LEVELS } from "@/lib/constants";
import { useAuth } from "@/lib/hooks/use-auth";
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
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Step1DetailsProps {
  onNext: () => void;
  onCreatingChange?: (isCreating: boolean) => void;
}

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

export function Step1Details({ onNext, onCreatingChange }: Step1DetailsProps) {
  const { register, isLoading: isAuthLoading } = useAuth();
  const [persistedData, setPersistedData] = useLocalStorageState<Partial<RegisterFormValues>>(
    "pidec_register_step1_form",
    {
      name: "",
      email: "",
      password: "",
      matricNumber: "",
      department: undefined,
      level: undefined,
    },
  );
  const [, setVerificationIdentity] = useLocalStorageState<{
    email: string;
    matricNumber: string;
  } | null>("pidec_verification_identity", null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as unknown as Resolver<RegisterFormValues>,
    defaultValues: {
      name: persistedData.name || "",
      email: persistedData.email || "",
      password: persistedData.password || "",
      matricNumber: persistedData.matricNumber || "",
      department: persistedData.department || undefined,
      level: persistedData.level || undefined,
    },
  });

  const passwordValue = form.watch("password");
  const matricValue = form.watch("matricNumber");

  const isMatricValid = /^(19|2[0-5])04\d{5}$/.test(matricValue || "");
  const matricStateClasses = matricValue
    ? isMatricValid
      ? "border-green-500 focus-visible:ring-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
      : "border-red-500 focus-visible:ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
    : "";

  useEffect(() => {
    const subscription = form.watch((value) => {
      setPersistedData((prev) => ({ ...prev, ...value }));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setPersistedData]);

  const onSubmit = async (data: RegisterFormValues) => {
    onCreatingChange?.(true);
    await waitForNextPaint();
    setVerificationIdentity({
      email: data.email,
      matricNumber: data.matricNumber,
    });
    try {
      await register(data);
      await new Promise((resolve) => setTimeout(resolve, 450));
      toast.success("Account created! Please upload your verification document.");
      onNext();
    } catch (error: unknown) {
      const apiError = extractApiError(error);
      toast.error(apiError.message || "Failed to create account. Please check your details.");
    } finally {
      onCreatingChange?.(false);
    }
  };

  const isSubmitting = form.formState.isSubmitting || isAuthLoading;

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-cyan)]">
          Create Account
        </p>
        <h1 className="font-heading text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
          Start your PIDEC registration
        </h1>
        <p className="max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
          Create your account to verify eligibility, build your team, and move
          into the competition flow.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-plum-soft)]">
                    Full Legal Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      className="h-14 rounded-2xl border-[rgba(42,0,59,0.1)] bg-white/90 px-4 text-base shadow-[0_10px_24px_rgba(42,0,59,0.05)]"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-plum-soft)]">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      type="email"
                      className="h-14 rounded-2xl border-[rgba(42,0,59,0.1)] bg-white/90 px-4 text-base shadow-[0_10px_24px_rgba(42,0,59,0.05)]"
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
                  <FormLabel className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-plum-soft)]">
                    Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Create a secure password"
                      className="h-14 rounded-2xl border-[rgba(42,0,59,0.1)] bg-white/90 px-4 text-base shadow-[0_10px_24px_rgba(42,0,59,0.05)]"
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
              name="matricNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-plum-soft)]">
                    Matric Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="210412345"
                      className={`h-14 rounded-2xl border-[rgba(42,0,59,0.1)] bg-white/90 px-4 text-base shadow-[0_10px_24px_rgba(42,0,59,0.05)] transition-all duration-300 ${matricStateClasses}`}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-plum-soft)]">
                      Department
                    </FormLabel>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-14 rounded-2xl border-[rgba(42,0,59,0.1)] bg-white/90 px-4 text-base shadow-[0_10px_24px_rgba(42,0,59,0.05)]">
                          <SelectValue placeholder="Select dept" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEPARTMENTS.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-plum-soft)]">
                      Level
                    </FormLabel>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={(val) => field.onChange(parseInt(val))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="h-14 rounded-2xl border-[rgba(42,0,59,0.1)] bg-white/90 px-4 text-base shadow-[0_10px_24px_rgba(42,0,59,0.05)]">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LEVELS.map((level) => (
                          <SelectItem key={level} value={level.toString()}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="h-14 w-full rounded-full border-0 bg-[linear-gradient(135deg,#6d2dff_0%,#8e4dff_48%,#b57cff_100%)] bg-[length:145%_145%] text-base font-semibold text-white shadow-[0_18px_34px_rgba(109,45,255,0.24)] hover:bg-[position:100%_50%] hover:shadow-[0_22px_42px_rgba(109,45,255,0.3)]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Creating account..."
            ) : (
              "Continue to Document Upload"
            )}
          </Button>
        </form>
      </Form>

      <div className="rounded-[1.5rem] border border-[rgba(42,0,59,0.08)] bg-[linear-gradient(135deg,rgba(18,183,234,0.08)_0%,rgba(142,77,255,0.08)_100%)] px-5 py-4 text-sm text-[var(--brand-plum-soft)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[var(--brand-purple)] transition-colors hover:text-[var(--brand-pink)]"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
