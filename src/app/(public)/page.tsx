import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, MapPin, Calendar } from "lucide-react";
import { HeroSlider } from "@/components/public/hero-slider";
import { EvolutionChartsSection } from "@/components/public/evolution-charts-section";
import { shapeImpactoEconomico, shapeDestinoMetric, shapeMovimientoTurista, shapeProcedencia } from "@/lib/evolution-data";

export const revalidate = 3600;

export default async function HomePage() {
  const allPeriodos = await prisma.periodo.findMany({
    orderBy: [{ anio: "desc" }, { temporada: "asc" }],
  });

  async function computeStats(periodoId: string) {
    const [movimientos, impacto, ocupaciones, gastos] = await Promise.all([
      prisma.movimientoTurista.findMany({ where: { periodoId } }),
      prisma.impactoEconomico.findFirst({ where: { periodoId } }),
      prisma.ocupacionHotelera.findMany({ where: { periodoId } }),
      prisma.gastoPromedio.findMany({ where: { periodoId } }),
    ]);
    return {
      turistas: movimientos.reduce((s, m) => s + (m.cantidadTuristas ?? 0), 0),
      impacto: impacto?.montoTotal ?? 0,
      ocupacion: ocupaciones.length > 0
        ? ocupaciones.reduce((s, o) => s + (o.ocupacionMensual ?? 0), 0) / ocupaciones.length
        : 0,
      gasto: gastos.length > 0
        ? gastos.reduce((s, g) => s + g.gastoDiarioPorPersona, 0) / gastos.length
        : 0,
    };
  }

  // Compute stats for all periodos
  const allStatsEntries = await Promise.all(
    allPeriodos.map(async (p) => {
      const stats = await computeStats(p.id);
      return [p.id, { ...stats, nombre: p.nombre }] as const;
    })
  );
  const allStats = Object.fromEntries(allStatsEntries);

  // Group periodos by season for the year selector
  const veranoPeriodos = allPeriodos
    .filter((p) => p.temporada === "Verano")
    .sort((a, b) => b.anio - a.anio)
    .map((p) => ({ id: p.id, anio: p.anio, nombre: p.nombre }));

  const inviernoPeriodos = allPeriodos
    .filter((p) => p.temporada === "Invierno")
    .sort((a, b) => b.anio - a.anio)
    .map((p) => ({ id: p.id, anio: p.anio, nombre: p.nombre }));

  // Fetch evolution data (all periods, all destinations)
  const allDestinos = await prisma.destino.findMany({ orderBy: { nombre: "asc" } });

  const [allImpactos, allMovimientos, allGastos, allProcedencias] = await Promise.all([
    prisma.impactoEconomico.findMany({
      include: { periodo: { select: { id: true, anio: true, temporada: true, nombre: true } } },
    }),
    prisma.movimientoTurista.findMany({
      include: {
        destino: { select: { id: true, nombre: true } },
        periodo: { select: { id: true, anio: true, temporada: true, nombre: true } },
      },
    }),
    prisma.gastoPromedio.findMany({
      include: {
        destino: { select: { id: true, nombre: true } },
        periodo: { select: { id: true, anio: true, temporada: true, nombre: true } },
      },
    }),
    prisma.procedencia.findMany({
      where: { tipoTurista: "turista" },
      select: {
        destinoId: true,
        periodoId: true,
        origen: true,
        porcentaje: true,
        tipoTurista: true,
        periodo: { select: { id: true, anio: true, temporada: true, nombre: true } },
      },
    }),
  ]);

  const periodoInfo = allPeriodos.map((p) => ({
    id: p.id,
    anio: p.anio,
    temporada: p.temporada,
    nombre: p.nombre,
  }));

  const destinoInfo = allDestinos.map((d) => ({
    id: d.id,
    nombre: d.nombre,
  }));

  // Verano evolution
  const veranoImpacto = shapeImpactoEconomico(allImpactos as never, "Verano");
  const veranoTuristas = shapeMovimientoTurista(allMovimientos as never, periodoInfo, destinoInfo, "Verano");
  const veranoGasto = shapeDestinoMetric(allGastos as never, "gastoDiarioPorPersona", periodoInfo, destinoInfo, "Verano");
  const veranoProcedencia = shapeProcedencia(allProcedencias as never, periodoInfo, "Verano");

  // Invierno evolution
  const inviernoImpacto = shapeImpactoEconomico(allImpactos as never, "Invierno");
  const inviernoTuristas = shapeMovimientoTurista(allMovimientos as never, periodoInfo, destinoInfo, "Invierno");
  const inviernoGasto = shapeDestinoMetric(allGastos as never, "gastoDiarioPorPersona", periodoInfo, destinoInfo, "Invierno");
  const inviernoProcedencia = shapeProcedencia(allProcedencias as never, periodoInfo, "Invierno");

  return (
    <div>
      <HeroSlider />
      {/* Quick info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">¿Qué encontrás en este sitio?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Perfil del Turista</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Procedencia, motivo de viaje, rango etario, compañía de viaje y más
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Gasto y Economía</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Gasto promedio diario, distribución del gasto, impacto económico y estadía
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Ocupación y Movimiento</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Ocupación hotelera, movimiento de turistas, pernoctaciones
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Evolution charts + key metrics */}
      <EvolutionChartsSection
        veranoImpacto={veranoImpacto}
        veranoTuristas={veranoTuristas}
        veranoGasto={veranoGasto}
        veranoProcedencia={veranoProcedencia}
        inviernoImpacto={inviernoImpacto}
        inviernoTuristas={inviernoTuristas}
        inviernoGasto={inviernoGasto}
        inviernoProcedencia={inviernoProcedencia}
        allStats={allStats}
        veranoPeriodos={veranoPeriodos}
        inviernoPeriodos={inviernoPeriodos}
      />

      {/* Period cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Balances Disponibles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allPeriodos.map((p) => {
              const slug = p.nombre.toLowerCase().replace(/\s+/g, "-");
              return (
                <Link key={p.id} href={`/balance/${slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-[#006e66]">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-[#006e66]" />
                        <CardTitle className="text-lg">{p.nombre}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {p.temporada === "Verano" ? "Enero - Febrero" : "Julio"} {p.anio}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}