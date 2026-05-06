import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordForm, ResetPasswordFallback } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Set a new password for your PIDEC 1.0 account using the secure reset link sent to your email.",
  // Reset URLs carry tokens — keep search engines away from them.
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
