import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const periodos = await prisma.periodo.findMany({
    orderBy: [{ anio: "desc" }, { temporada: "asc" }],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logos/Logo Observatorio Turístico ETT 2025.png"
              alt="Observatorio Turístico ETT"
              width={180}
              height={50}
              className="h-12 w-auto"
            />
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary">
              Inicio
            </Link>
            <Link href="/quienes-somos" className="text-sm font-medium text-foreground hover:text-primary">
              Quiénes somos
            </Link>
            <div className="relative group">
              <button className="text-sm font-medium text-foreground hover:text-primary flex items-center gap-1">
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
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md"
                    >
                      {p.nombre}
                    </Link>
                  );
                })}
              </div>
            </div>
            <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary">
              Iniciar sesión
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-[#223468] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <Image
                src="/logos/Imagotipo ETT - horizontal - blanco - sin fondo.png"
                alt="Ente Tucumán Turismo"
                width={200}
                height={60}
                className="h-14 w-auto mb-3"
              />
              <p className="text-sm text-white/80">
                Observatorio Turístico de Tucumán
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Enlaces</h3>
              <ul className="space-y-1 text-sm text-white/80">
                <li><Link href="/" className="hover:text-white">Inicio</Link></li>
                <li><Link href="/quienes-somos" className="hover:text-white">Quiénes somos</Link></li>
                <li><a href="https://www.tucumanturismo.gob.ar" target="_blank" className="hover:text-white">Tucumán Turismo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contacto</h3>
              <p className="text-sm text-white/80">
                San Martín 800, San Miguel de Tucumán
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-white/20 pt-4 text-center text-xs text-white/60">
            &copy; {new Date().getFullYear()} Ente Tucumán Turismo. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}