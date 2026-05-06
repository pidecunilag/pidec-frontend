"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/lib/hooks/use-auth";

import { Step1Details } from "@/components/auth/register/Step1Details";
import { Step2Upload } from "@/components/auth/register/Step2Upload";
import { Step3Polling } from "@/components/auth/register/Step3Polling";

export function RegisterFlow() {
  const router = useRouter();
  const { isAuthenticated, user, verificationStatus, isLoading } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        if (verificationStatus === "verified" || verificationStatus === "flagged") {
          if (user.role === "admin") router.push("/admin");
          else if (user.role === "judge") router.push("/judge");
          else router.push("/dashboard");
        } else if (verificationStatus === "pending") {
          setStep(3);
        } else if (verificationStatus === "rejected") {
          setStep(3);
        } else if (!verificationStatus) {
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
