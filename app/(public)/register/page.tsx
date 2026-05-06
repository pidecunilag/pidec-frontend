import type { Metadata } from "next";

import { RegisterFlow } from "./register-flow";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create your PIDEC 1.0 account. Engineering students at the University of Lagos can register, verify eligibility, and form a team for the competition.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  return <RegisterFlow />;
}
