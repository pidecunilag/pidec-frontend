import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your PIDEC 1.0 account to manage your team, track submissions, and review judge feedback.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return <LoginForm />;
}
