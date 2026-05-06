"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, TriangleAlert } from "lucide-react";

import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token provided.");
      return;
    }

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const verify = async () => {
      try {
        await authApi.verifyEmail({ token });
        setStatus("success");
      } catch (error: any) {
        setStatus("error");
        setErrorMessage(
          error.message || "The verification link is invalid or has expired."
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-center animate-in fade-in duration-500">
      {status === "loading" && (
        <div className="py-12 space-y-6 flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Verifying your email...
          </h1>
          <p className="text-muted-foreground text-lg">
            Please wait a moment while we securely verify your email address.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="h-8 w-8 text-brand" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Email Verified
          </h1>
          <p className="text-muted-foreground text-lg">
            Your email has been successfully verified. You can now log in to your account.
          </p>
          <div className="pt-6">
            <Button asChild className="w-full h-12 text-base font-semibold">
              <Link href="/login">Continue to Login</Link>
            </Button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
            <TriangleAlert className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Verification Failed
          </h1>
          <p className="text-muted-foreground text-lg">
            {errorMessage}
          </p>
          <div className="pt-6 space-y-4">
            <Button asChild className="w-full h-12 text-base font-semibold">
              <Link href="/login">Go to Login</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md mx-auto py-12 space-y-6 flex flex-col items-center text-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Loading...
        </h1>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
