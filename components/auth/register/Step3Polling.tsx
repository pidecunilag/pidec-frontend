"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert, ShieldCheck, Clock, FileUp } from "lucide-react";

import { useVerification } from "@/lib/hooks/use-verification";
import { Button } from "@/components/ui/button";

interface Step3PollingProps {
  onReupload: () => void;
}

export function Step3Polling({ onReupload }: Step3PollingProps) {
  const router = useRouter();
  const { status, error, cooldownRemainingMs } = useVerification({ poll: true });
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (status !== "rejected") {
      return;
    }

    const initialSeconds = Math.ceil(cooldownRemainingMs / 1000);
    queueMicrotask(() => setCooldown(initialSeconds));

    if (initialSeconds <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, cooldownRemainingMs]);

  const isCooldownActive = cooldown > 0;

  const formatCooldown = (seconds: number) => {
    if (seconds <= 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (status === "verified") {
    return (
      <div className="w-full space-y-6 text-center animate-in fade-in duration-500">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(18,183,234,0.12)]">
          <ShieldCheck className="h-8 w-8 text-[var(--brand-cyan)]" />
        </div>
        <h1 className="font-heading text-4xl font-semibold tracking-[-0.06em] text-foreground">
          Verification Complete!
        </h1>
        <p className="text-lg text-muted-foreground">
          Your student identity has been successfully verified. Welcome to PIDEC 1.0!
        </p>
        <div className="pt-6">
          <Button
            onClick={() => router.push("/dashboard")}
            className="h-14 w-full rounded-full border-0 bg-[linear-gradient(135deg,#6d2dff_0%,#8e4dff_48%,#b57cff_100%)] bg-[length:145%_145%] text-base font-semibold text-white shadow-[0_18px_34px_rgba(109,45,255,0.24)] hover:bg-[position:100%_50%] hover:shadow-[0_22px_42px_rgba(109,45,255,0.3)]"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="w-full space-y-6 text-center animate-in fade-in duration-500">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="font-heading text-4xl font-semibold tracking-[-0.06em] text-foreground">
          Verification Failed
        </h1>
        <p className="text-lg text-muted-foreground">
          We couldn&apos;t verify your details from the uploaded document. The name or matric number did not match.
        </p>

        <div className="mt-6 rounded-[1.5rem] bg-[rgba(42,0,59,0.05)] p-4">
          <div className="mb-2 flex items-center justify-center text-muted-foreground">
            <Clock className="mr-2 h-5 w-5" />
            <span className="font-medium">
              {isCooldownActive ? "Cooldown Active" : "Ready to re-upload"}
            </span>
          </div>
          <p className="text-sm">
            {isCooldownActive ? (
              <>
                Please review your document. You can try uploading again in{" "}
                <span className="font-bold text-foreground">{formatCooldown(cooldown)}</span>.
              </>
            ) : (
              "Please review your document and upload a clearer copy when ready."
            )}
          </p>
        </div>

        <div className="pt-4">
          <Button
            onClick={onReupload}
            disabled={isCooldownActive}
            className="h-14 w-full rounded-full border-0 bg-[linear-gradient(135deg,#6d2dff_0%,#8e4dff_48%,#b57cff_100%)] bg-[length:145%_145%] text-base font-semibold text-white shadow-[0_18px_34px_rgba(109,45,255,0.24)] hover:bg-[position:100%_50%] hover:shadow-[0_22px_42px_rgba(109,45,255,0.3)]"
          >
            <FileUp className="mr-2 h-5 w-5" />
            Re-upload Document
          </Button>
        </div>
      </div>
    );
  }

  if (status === "flagged") {
    return (
      <div className="w-full space-y-6 text-center animate-in fade-in duration-500">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <ShieldAlert className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="font-heading text-4xl font-semibold tracking-[-0.06em] text-foreground">
          Under Manual Review
        </h1>
        <p className="text-lg text-muted-foreground">
          Our automated system couldn&apos;t confidently verify your document. An admin will review it manually within 24 hours.
        </p>
        <div className="pt-6">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="h-14 w-full rounded-full border-[rgba(18,183,234,0.18)] bg-[linear-gradient(135deg,rgba(18,183,234,0.14)_0%,rgba(142,77,255,0.12)_100%)] text-base font-semibold text-[var(--brand-plum)] shadow-[0_14px_28px_rgba(18,183,234,0.08)] hover:bg-[linear-gradient(135deg,rgba(18,183,234,0.22)_0%,rgba(142,77,255,0.18)_100%)] hover:text-[var(--brand-plum)]"
          >
            Go to Dashboard (Limited Access)
          </Button>
        </div>
      </div>
    );
  }

  if (error === "AUTH_REQUIRED") {
    return (
      <div className="w-full space-y-6 text-center animate-in fade-in duration-500">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
          <FileUp className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="font-heading text-4xl font-semibold tracking-[-0.06em] text-foreground">
          Document Uploaded!
        </h1>
        <p className="text-lg text-muted-foreground">
          Your verification document has been securely submitted. However, your session is unverified.
        </p>
        <div className="mt-6 rounded-[1.5rem] bg-[rgba(42,0,59,0.05)] p-4">
          <p className="text-sm font-medium">
            Please check your email and click the verification link, then log in to view your application status.
          </p>
        </div>
        <div className="pt-4">
          <Button
            onClick={() => router.push("/login")}
            className="h-14 w-full rounded-full border-0 bg-[linear-gradient(135deg,#6d2dff_0%,#8e4dff_48%,#b57cff_100%)] bg-[length:145%_145%] text-base font-semibold text-white shadow-[0_18px_34px_rgba(109,45,255,0.24)] hover:bg-[position:100%_50%] hover:shadow-[0_22px_42px_rgba(109,45,255,0.3)]"
          >
            Continue to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-center animate-in fade-in duration-500">
      <div className="flex flex-col items-center space-y-8 py-12">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[rgba(42,0,59,0.08)] bg-white/80">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--brand-purple)]" />
          </div>
          <div
            className="absolute left-0 top-0 h-24 w-24 animate-spin rounded-full border-4 border-[var(--brand-orange)] border-t-transparent"
            style={{ animationDirection: "reverse", animationDuration: "3s" }}
          />
        </div>

        <div className="space-y-3">
          <h1 className="font-heading text-4xl font-semibold tracking-[-0.06em] text-foreground">
            Checking your document
          </h1>
          <p className="text-lg text-muted-foreground">
            Please wait while we verify your upload. This usually takes a few seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
