import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MapPin, BarChart3, Calendar } from "lucide-react";
import { HeroSlider } from "@/components/public/hero-slider";
import { EvolutionChartsSection } from "@/components/public/evolution-charts-section";
import { FeatureCard } from "@/components/public/feature-card";
import { LinkCard } from "@/components/public/link-card";
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">¿Qué encontrás en este sitio?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={MapPin}
              title="Perfil del Turista"
              description="Procedencia, motivo de viaje, rango etario, compañía de viaje y más"
            />
            <FeatureCard
              icon={BarChart3}
              title="Gasto y Economía"
              description="Gasto promedio diario, distribución del gasto, impacto económico y estadía"
            />
            <FeatureCard
              icon={Calendar}
              title="Ocupación y Movimiento"
              description="Ocupación hotelera, movimiento de turistas, pernoctaciones"
            />
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
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {allPeriodos.map((p) => {
              const slug = p.nombre.toLowerCase().replace(/\s+/g, "-");
              return (
                <LinkCard
                  key={p.id}
                  href={`/balance/${slug}`}
                  icon={Calendar}
                  title={p.nombre}
                  description={`${p.temporada === "Verano" ? "Enero - Febrero" : "Julio"} ${p.anio}`}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}