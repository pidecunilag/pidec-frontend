"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/lib/hooks/use-auth";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { VerificationStatus } from "@/lib/types";

import { Step1Details } from "@/components/auth/register/Step1Details";
import { Step2Upload } from "@/components/auth/register/Step2Upload";
import { Step3Polling } from "@/components/auth/register/Step3Polling";

function normalizeVerificationStatus(status: string): VerificationStatus {
  const normalized = status.trim().toLowerCase();

  switch (normalized) {
    case "pending":
    case "processing":
    case "in_review":
      return "pending";
    case "verified":
    case "approved":
    case "success":
      return "verified";
    case "rejected":
    case "failed":
    case "declined":
    case "mismatch":
      return "rejected";
    case "flagged":
    case "manual_review":
    case "under_review":
      return "flagged";
    case "suspended":
      return "suspended";
    default:
      return "rejected";
  }
}

export function RegisterFlow() {
  const router = useRouter();
  const { isAuthenticated, user, verificationStatus, isLoading } = useAuth();
  const { setVerificationStatus } = useAuthStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isResolvingStatus, setIsResolvingStatus] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const resolvedStatusUserRef = useRef<string | null>(null);
  const userId = user?.id;
  const userRole = user?.role;

  const handleCreatingChange = useCallback((nextState: boolean) => {
    setIsCreatingAccount(nextState);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated && userId && resolvedStatusUserRef.current !== userId) {
      let cancelled = false;
      resolvedStatusUserRef.current = userId;

      const resolveVerificationStatus = async () => {
        setIsResolvingStatus(true);
        try {
          const result = await authApi.getVerificationStatus();
          const normalizedStatus = normalizeVerificationStatus(result.status);
          const hasUploadedDocument = (result.attempts ?? 0) > 0;

          if (!cancelled) {
            setVerificationStatus(normalizedStatus);

            if (normalizedStatus === "verified" || normalizedStatus === "flagged") {
              if (userRole === "admin") router.push("/admin");
              else if (userRole === "judge") router.push("/judge");
              else router.push("/dashboard");
              return;
            }

            if (normalizedStatus === "rejected") {
              setStep(3);
              return;
            }

            if (normalizedStatus === "pending" && hasUploadedDocument) {
              setStep(3);
              return;
            }

            setStep(2);
          }
        } catch {
          if (!cancelled) {
            setStep(2);
          }
        } finally {
          if (!cancelled) {
            setIsResolvingStatus(false);
          }
        }
      };

      void resolveVerificationStatus();

      return () => {
        cancelled = true;
      };
    }
  }, [isLoading, isAuthenticated, userId, userRole, router, setVerificationStatus]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && userId) {
        if (verificationStatus === "verified" || verificationStatus === "flagged") {
          if (userRole === "admin") router.push("/admin");
          else if (userRole === "judge") router.push("/judge");
          else router.push("/dashboard");
        } else if (verificationStatus === "rejected") {
          queueMicrotask(() => setStep(3));
        } else if (!verificationStatus) {
          queueMicrotask(() => setStep(2));
        }
      }
    }
  }, [isAuthenticated, userId, userRole, verificationStatus, isLoading, router]);

  const creatingAccountOverlay = isCreatingAccount ? (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-[rgba(42,0,59,0.34)] px-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-white/20 bg-white/94 p-8 text-center shadow-[0_28px_80px_rgba(42,0,59,0.22)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(109,45,255,0.14)_0%,rgba(18,183,234,0.14)_100%)]">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-purple)]" />
        </div>
        <h2 className="mt-5 font-heading text-3xl font-semibold tracking-[-0.05em] text-foreground">
          Creating your account
        </h2>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Please wait while we set up your PIDEC profile.
        </p>
      </div>
    </div>
  ) : null;

  if (isLoading || isResolvingStatus) {
    return (
      <>
        {creatingAccountOverlay}
        {!isCreatingAccount && (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-purple)]" />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {creatingAccountOverlay}

      {step === 1 && (
        <Step1Details
          onNext={() => setStep(2)}
          onCreatingChange={handleCreatingChange}
        />
      )}
      {step === 2 && (
        <Step2Upload
          onNext={() => setStep(3)}
          isReupload={verificationStatus === "rejected"}
        />
      )}
      {step === 3 && <Step3Polling onReupload={() => setStep(2)} />}
    </>
  );
}
