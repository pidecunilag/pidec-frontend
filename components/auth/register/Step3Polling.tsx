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
  const { status, error } = useVerification();
  const [cooldown, setCooldown] = useState(0);

  // If rejected, start a 10-minute cooldown
  useEffect(() => {
    if (status === "rejected") {
      setCooldown(600); // 10 minutes in seconds
      
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
    }
  }, [status]);

  const formatCooldown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (status === "verified") {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center animate-in fade-in duration-500">
        <div className="mx-auto w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="h-8 w-8 text-brand" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Verification Complete!
        </h1>
        <p className="text-muted-foreground text-lg">
          Your student identity has been successfully verified. Welcome to PIDEC 1.0!
        </p>
        <div className="pt-6">
          <Button onClick={() => router.push("/dashboard")} className="w-full h-12 text-base font-semibold">
            Continue to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center animate-in fade-in duration-500">
        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Verification Failed
        </h1>
        <p className="text-muted-foreground text-lg">
          We couldn't verify your details from the uploaded document. The name or matric number did not match.
        </p>
        
        <div className="bg-muted p-4 rounded-lg mt-6">
          <div className="flex items-center justify-center text-muted-foreground mb-2">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-medium">Cooldown Active</span>
          </div>
          <p className="text-sm">
            Please review your document. You can try uploading again in{" "}
            <span className="font-bold text-foreground">{formatCooldown(cooldown)}</span>.
          </p>
        </div>

        <div className="pt-4">
          <Button 
            onClick={onReupload} 
            disabled={cooldown > 0} 
            className="w-full h-12 text-base font-semibold"
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
      <div className="w-full max-w-md mx-auto space-y-6 text-center animate-in fade-in duration-500">
        <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Under Manual Review
        </h1>
        <p className="text-muted-foreground text-lg">
          Our automated system couldn't confidently verify your document. An admin will review it manually within 24 hours.
        </p>
        <div className="pt-6">
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="w-full h-12 text-base font-semibold">
            Go to Dashboard (Limited Access)
          </Button>
        </div>
      </div>
    );
  }

  if (error === "AUTH_REQUIRED") {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center animate-in fade-in duration-500">
        <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
          <FileUp className="h-8 w-8 text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Document Uploaded!
        </h1>
        <p className="text-muted-foreground text-lg">
          Your verification document has been securely submitted. However, your session is unverified.
        </p>
        <div className="bg-muted p-4 rounded-lg mt-6">
          <p className="text-sm font-medium">
            Please check your email and click the verification link, then log in to view your application status.
          </p>
        </div>
        <div className="pt-4">
          <Button onClick={() => router.push("/login")} className="w-full h-12 text-base font-semibold">
            Continue to Login
          </Button>
        </div>
      </div>
    );
  }

  // Pending status
  return (
    <div className="w-full max-w-md mx-auto space-y-6 text-center animate-in fade-in duration-500">
      <div className="py-12 space-y-8 flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-muted flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-brand" />
          </div>
          <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-brand border-t-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "3s" }} />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Verifying Document
          </h1>
          <p className="text-muted-foreground text-lg">
            Our AI is analyzing your document. This usually takes less than 30 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
