import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BalanceContent } from "@/components/public/balance-content";

interface BalancePageProps {
  params: Promise<{ periodo: string }>;
}

export const revalidate = 3600;

export default async function BalancePage({ params }: BalancePageProps) {
  const { periodo: periodoSlug } = await params;
  const periodoNombre = periodoSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const periodo = await prisma.periodo.findFirst({
    where: { nombre: { contains: periodoNombre, mode: "insensitive" } },
  });

  if (!periodo) notFound();

  const destinos = await prisma.destino.findMany({ orderBy: { nombre: "asc" } });
  const allPeriodos = await prisma.periodo.findMany({ orderBy: [{ anio: "desc" }, { temporada: "asc" }] });

  // Find previous period of same season for comparison
  const previousPeriodo = await prisma.periodo.findFirst({
    where: { temporada: periodo.temporada, anio: { lt: periodo.anio } },
    orderBy: { anio: "desc" },
  });

  // Fetch all data categories for current period
  const [
    procedencias, motivosViaje, rangosEdad, gastos, ocupaciones, perfiles,
    infosPrevia, sitiosConsultados, companiasViaje, anticipacionesViaje,
    estadias, actividades, movimientos, pernoctesExtra, impacto, nota,
  ] = await Promise.all([
    prisma.procedencia.findMany({ where: { periodoId: periodo.id } }),
    prisma.motivoViaje.findMany({ where: { periodoId: periodo.id } }),
    prisma.rangoEdad.findMany({ where: { periodoId: periodo.id } }),
    prisma.gastoPromedio.findMany({ where: { periodoId: periodo.id }, include: { destino: true } }),
    prisma.ocupacionHotelera.findMany({ where: { periodoId: periodo.id }, include: { destino: true } }),
    prisma.perfilTurista.findMany({ where: { periodoId: periodo.id }, include: { destino: true } }),
    prisma.infoPrevia.findMany({ where: { periodoId: periodo.id }, include: { destino: true } }),
    prisma.sitioConsultado.findMany({ where: { periodoId: periodo.id }, include: { destino: true } }),
    prisma.companiaViaje.findMany({ where: { periodoId: periodo.id }, include: { destino: true } }),
    prisma.anticipacionViaje.findMany({ where: { periodoId: periodo.id }, include: { destino: true } }),
    prisma.estadiaPromedio.findMany({ where: { periodoId: periodo.id }, include: { destino: true } }),
    prisma.actividad.findMany({ where: { periodoId: periodo.id }, include: { destino: true } }),
    prisma.movimientoTurista.findMany({ where: { periodoId: periodo.id }, include: { destino: true } }),
    prisma.pernocteExtraHotelero.findMany({ where: { periodoId: periodo.id }, include: { destino: true } }),
    prisma.impactoEconomico.findFirst({ where: { periodoId: periodo.id } }),
    prisma.notaMetodologica.findFirst({ where: { periodoId: periodo.id } }),
  ]);

  // Fetch previous period data for comparison
  const [previousGastos, previousOcupaciones, previousMovimientos] = previousPeriodo
    ? await Promise.all([
        prisma.gastoPromedio.findMany({ where: { periodoId: previousPeriodo.id }, include: { destino: true } }),
        prisma.ocupacionHotelera.findMany({ where: { periodoId: previousPeriodo.id }, include: { destino: true } }),
        prisma.movimientoTurista.findMany({ where: { periodoId: previousPeriodo.id }, include: { destino: true } }),
      ])
    : [[], [], []];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#006e66] to-[#223468] text-white py-12">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold rounded-md bg-brand w-fit px-4 py-1">Balance {periodo.nombre}</h1>
          <p className="text-[15px] text-white bg-[#EA7220] px-4 py-1 mt-1 w-fit rounded-md">
            Datos del Observatorio Turístico de Tucumán
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-4">
        <BalanceContent
          periodo={periodo}
          periodos={allPeriodos}
          destinos={destinos}
          procedencias={procedencias}
          motivosViaje={motivosViaje}
          rangosEdad={rangosEdad}
          gastos={gastos}
          ocupaciones={ocupaciones}
          perfiles={perfiles}
          infosPrevia={infosPrevia}
          sitiosConsultados={sitiosConsultados}
          companiasViaje={companiasViaje}
          anticipacionesViaje={anticipacionesViaje}
          estadias={estadias}
          actividades={actividades}
          movimientos={movimientos}
          pernoctesExtra={pernoctesExtra}
          impacto={impacto}
          nota={nota}
          previousPeriodoId={previousPeriodo?.id ?? null}
          previousGastos={previousGastos}
          previousOcupaciones={previousOcupaciones}
          previousMovimientos={previousMovimientos}
        />
      </main>
    </>
  );
}