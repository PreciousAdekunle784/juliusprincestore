import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-[82vh] grid place-items-center bg-mist px-4 py-14">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-6">
          <span className="font-display font-bold tracking-tight text-lg">JULIUS PRINCE</span>
          <span className="eyebrow text-accent-press ml-1">Store</span>
        </Link>
        <div className="bg-paper border border-black/[0.07] rounded-[8px] p-8 shadow-sm">
          <h1 className="font-display font-bold text-2xl tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-slate mt-1.5">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {footer && <p className="text-center text-sm text-slate mt-5">{footer}</p>}
      </div>
    </div>
  );
}

export const authInput =
  "w-full border border-black/15 rounded-[3px] px-3 py-2.5 text-sm outline-none focus:border-accent";
