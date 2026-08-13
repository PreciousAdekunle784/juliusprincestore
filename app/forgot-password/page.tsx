import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "@/components/auth/forgot-form";

export const metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we’ll send you a reset link."
      footer={<Link href="/login" className="text-accent-press hover:underline">Back to sign in</Link>}
    >
      <ForgotForm />
    </AuthShell>
  );
}
