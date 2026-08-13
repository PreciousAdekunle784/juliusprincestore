import { requireUser } from "@/lib/auth";
import { AccountNav } from "@/components/account/account-nav";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return (
    <>
      <section className="bg-ink text-paper">
        <div className="container-screen py-10">
          <p className="eyebrow text-accent mb-2">Your account</p>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">Account</h1>
        </div>
      </section>
      <div className="container-screen py-8 md:py-10 grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 h-fit">
          <AccountNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </>
  );
}
