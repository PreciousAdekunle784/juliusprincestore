import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Create account" };

export default async function RegisterPage() {
  if (await getSessionUser()) redirect("/account");
  return (
    <AuthShell
      title="Create your account"
      subtitle="Save your details, track orders and build a wishlist."
      footer={<>Already have an account? <Link href="/login" className="text-accent-press hover:underline">Sign in</Link></>}
    >
      <RegisterForm />
    </AuthShell>
  );
}
