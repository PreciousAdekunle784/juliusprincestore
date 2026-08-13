import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign in" };
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function LoginPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const next = first(searchParams.next) ?? "/account";
  if (await getSessionUser()) redirect(next);
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track orders and manage your account."
      footer={<>New here? <Link href="/register" className="text-accent-press hover:underline">Create an account</Link></>}
    >
      <LoginForm next={next} />
    </AuthShell>
  );
}
