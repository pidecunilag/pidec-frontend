import type { Metadata } from "next";
import { Suspense } from "react";

import { VerifyEmailFlow, VerifyEmailFallback } from "./verify-email-flow";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Confirm your email address to activate your PIDEC 1.0 account.",
  // Verification URLs carry tokens — keep search engines away from them.
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailFlow />
    </Suspense>
  );
}
