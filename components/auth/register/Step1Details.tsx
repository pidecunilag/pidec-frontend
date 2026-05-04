"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Step1DetailsProps {
  onNext: () => void;
}

export function Step1Details({ onNext }: Step1DetailsProps) {
  const { register } = useAuth();
  
  // Persist form inputs in localStorage
  const [persistedData, setPersistedData] = useLocalStorageState<Partial<RegisterFormValues>>(
    "pidec_register_step1_form",
    { name: "", email: "", password: "", matricNumber: "", department: undefined, level: undefined }
  );

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      name: persistedData.name || "",
      email: persistedData.email || "",
      password: persistedData.password || "",
      matricNumber: persistedData.matricNumber || "",
      // Need to cast to any initially to satisfy TS if it's undefined from local storage
      department: (persistedData.department as any) || undefined,
      level: (persistedData.level as any) || undefined,
    },
  });

  const passwordValue = form.watch("password");

  // Sync form to local storage
  useEffect(() => {
    const subscription = form.watch((value: any) => {
      setPersistedData((prev) => ({ ...prev, ...value }));
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setPersistedData]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await register(data);
      toast.success("Account created! Please upload your verification document.");
      onNext();
    } catch (error: any) {
      const apiError = extractApiError(error);
      toast.error(apiError.message || "Failed to create account. Please check your details.");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="w-full max-w-md mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create an Account
        </h1>
        <p className="text-muted-foreground text-lg">
          Join PIDEC 1.0 to compete, collaborate, and innovate.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Full Legal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" className="h-12 text-base" disabled={isSubmitting} {...field} />
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
                  <FormLabel className="text-base">Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" className="h-12 text-base" disabled={isSubmitting} {...field} />
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
                  <FormLabel className="text-base">Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" className="h-12 text-base" disabled={isSubmitting} {...field} />
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
                  <FormLabel className="text-base">Matric Number</FormLabel>
                  <FormControl>
                    <Input placeholder="210412345" className="h-12 text-base" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Department</FormLabel>
                    <Select disabled={isSubmitting} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 text-base">
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
                    <FormLabel className="text-base">Level</FormLabel>
                    <Select 
                      disabled={isSubmitting} 
                      onValueChange={(val) => field.onChange(parseInt(val))} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 text-base">
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

          <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Continue to Document Upload"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
