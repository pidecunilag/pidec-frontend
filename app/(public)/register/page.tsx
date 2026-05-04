"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/lib/hooks/use-auth";

import { Step1Details } from "@/components/auth/register/Step1Details";
import { Step2Upload } from "@/components/auth/register/Step2Upload";
import { Step3Polling } from "@/components/auth/register/Step3Polling";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, user, verificationStatus, isLoading } = useAuth();
  
  // Determine initial step based on auth state
  // 1: Details, 2: Upload, 3: Polling
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        if (verificationStatus === "verified" || verificationStatus === "flagged") {
          // They shouldn't be here, route away
          if (user.role === "admin") router.push("/admin");
          else if (user.role === "judge") router.push("/judge");
          else router.push("/dashboard");
        } else if (verificationStatus === "pending") {
          // Need to wait
          setStep(3);
        } else if (verificationStatus === "rejected") {
          // Need to re-upload
          setStep(3); // The polling screen handles the rejected state and provides the re-upload button
        } else if (!verificationStatus) {
          // Authenticated but no verification status (legacy or interrupted flow)
          setStep(2);
        }
      }
    }
  }, [isAuthenticated, user, verificationStatus, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <>
      {step === 1 && <Step1Details onNext={() => setStep(2)} />}
      {step === 2 && <Step2Upload onNext={() => setStep(3)} isReupload={verificationStatus === "rejected"} />}
      {step === 3 && <Step3Polling onReupload={() => setStep(2)} />}
    </>
  );
}
