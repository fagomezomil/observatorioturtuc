"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavProps {
  periodos: { id: string; nombre: string }[];
}

const active = "bg-[#e9721f] text-white";
const idle = "text-foreground hover:bg-primary hover:text-white";

export function Nav({ periodos }: NavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const cls = (href: string) =>
    `text-sm font-medium rounded-md px-3 py-1.5 transition-colors ${isActive(href) ? active : idle}`;

  const isBalanceActive = pathname.startsWith("/balance");

  return (
    <nav className="flex items-center gap-6">
      <Link href="/" className={cls("/")}>Inicio</Link>
      <Link href="/quienes-somos" className={cls("/quienes-somos")}>Quiénes somos</Link>
      <div className="relative group">
        <button className={`text-sm font-medium rounded-md px-3 py-1.5 transition-colors flex items-center gap-1 ${isBalanceActive ? active : idle}`}>
          Balances
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          {periodos.map((p) => {
            const slug = p.nombre.toLowerCase().replace(/\s+/g, "-");
            return (
              <Link
                key={p.id}
                href={`/balance/${slug}`}
                className="block px-4 py-2 text-sm text-foreground hover:bg-primary hover:text-white transition-colors first:rounded-t-md last:rounded-b-md"
              >
                {p.nombre}
              </Link>
            );
          })}
        </div>
      </div>
      <Link href="/login" className={cls("/login")}>Iniciar sesión</Link>
    </nav>
  );
}