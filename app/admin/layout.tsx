import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr] min-h-screen">
      <aside className="bg-ink text-paper lg:sticky lg:top-0 lg:h-screen p-5">
        <p className="font-display font-bold tracking-tight mb-6 px-2">
          JP <span className="text-accent">Admin</span>
        </p>
        <AdminNav />
      </aside>
      <main className="bg-mist/40 min-h-screen">
        <div className="max-w-5xl mx-auto p-5 md:p-8">{children}</div>
      </main>
    </div>
  );
}
