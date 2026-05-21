import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/public/nav";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const periodos = await prisma.periodo.findMany({
    orderBy: [{ anio: "desc" }, { temporada: "asc" }],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-1">
          <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logos/Logo Observatorio Turístico ETT 2025.png"
            alt="Observatorio Turístico ETT"
            width={90}
            height={25}
            
          />
            <Image
              src="/logos/Imagotipo ETT - horizontal - full color - sin fondo.png"
              alt="Ente Tucumán Turismo"
              width={220}
              height={25}
              
            />
          </Link>
          <Nav periodos={periodos} />
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-[#223468] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-semibold mb-2">Enlaces</h3>
              <ul className="space-y-1 text-sm text-white/80">
                <li><Link href="/" className="hover:text-white">Inicio</Link></li>
                <li><Link href="/quienes-somos" className="hover:text-white">Quiénes somos</Link></li>
                <li><a href="https://www.tucumanturismo.gob.ar" target="_blank" className="hover:text-white">Tucumán Turismo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Ente Tucumán Turismo</h3>
              <p className="text-sm text-white/80">Santa Fe 2121 — San Miguel de Tucumán</p>
              <p className="text-sm text-white/80">Tucumán — Argentina</p>
              <p className="text-sm text-white/80">CP 4000</p>
              <p className="text-sm text-white/80">+54 (0381) 262-1377</p>
              <a href="mailto:informes@tucumanturismo.gob.ar" className="text-sm text-white/80 hover:text-white">informes@tucumanturismo.gob.ar</a>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Casa de Tucumán en Buenos Aires</h3>
              <p className="text-sm text-white/80">Suipacha 140 — C.A.B.A.</p>
              <p className="text-sm text-white/80">Provincia de Buenos Aires — Argentina</p>
              <p className="text-sm text-white/80">CP C1008AAD</p>
              <p className="text-sm text-white/80">(011) 4322-0562</p>
              <a href="mailto:casaenbsas@tucumanturismo.gob.ar" className="text-sm text-white/80 hover:text-white">casaenbsas@tucumanturismo.gob.ar</a>
            </div>
            <div className="text-right items-end flex flex-col">
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
          </div>
          <div className="mt-6 border-t border-white/20 pt-4 text-center text-xs text-white/60">
            &copy; {new Date().getFullYear()} Ente Tucumán Turismo. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}