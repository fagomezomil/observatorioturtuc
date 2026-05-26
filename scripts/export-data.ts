import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function exportData() {
  console.log("Exportando datos de la base de datos...");

  const destinos = await prisma.destino.findMany({
    orderBy: { nombre: "asc" },
  });

  const periodos = await prisma.periodo.findMany({
    orderBy: [{ anio: "asc" }, { temporada: "asc" }],
  });

  const ocupacionesHoteleras = await prisma.ocupacionHotelera.findMany({
    include: { destino: true, periodo: true },
  });

  const perfilesTurista = await prisma.perfilTurista.findMany({
    include: { destino: true, periodo: true },
  });

  const procedencias = await prisma.procedencia.findMany({
    include: { destino: true, periodo: true },
  });

  const motivosViaje = await prisma.motivoViaje.findMany({
    include: { destino: true, periodo: true },
  });

  const rangosEdad = await prisma.rangoEdad.findMany({
    include: { destino: true, periodo: true },
  });

  const infosPrevia = await prisma.infoPrevia.findMany({
    include: { destino: true, periodo: true },
  });

  const sitiosConsultados = await prisma.sitioConsultado.findMany({
    include: { destino: true, periodo: true },
  });

  const companiasViaje = await prisma.companiaViaje.findMany({
    include: { destino: true, periodo: true },
  });

  const anticipacionesViaje = await prisma.anticipacionViaje.findMany({
    include: { destino: true, periodo: true },
  });

  const estadiasPromedio = await prisma.estadiaPromedio.findMany({
    include: { destino: true, periodo: true },
  });

  const gastosPromedio = await prisma.gastoPromedio.findMany({
    include: { destino: true, periodo: true },
  });

  const actividades = await prisma.actividad.findMany({
    include: { destino: true, periodo: true },
  });

  const impactosEconomicos = await prisma.impactoEconomico.findMany({
    include: { periodo: true },
  });

  const movimientoTuristas = await prisma.movimientoTurista.findMany({
    include: { destino: true, periodo: true },
  });

  const pernoctesExtraHoteleros = await prisma.pernocteExtraHotelero.findMany({
    include: { destino: true, periodo: true },
  });

  const notasMetodologicas = await prisma.notaMetodologica.findMany({
    include: { periodo: true },
  });

  const data = {
    exportDate: new Date().toISOString(),
    destinos,
    periodos,
    ocupacionesHoteleras,
    perfilesTurista,
    procedencias,
    motivosViaje,
    rangosEdad,
    infosPrevia,
    sitiosConsultados,
    companiasViaje,
    anticipacionesViaje,
    estadiasPromedio,
    gastosPromedio,
    actividades,
    impactosEconomicos,
    movimientoTuristas,
    pernoctesExtraHoteleros,
    notasMetodologicas,
  };

  const outputPath = join(process.cwd(), "data", "export.json");
  writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");

  const stats = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.length : value,
    ])
  );
  console.log("Exportación completada:");
  console.table(stats);
  console.log(`\nArchivo guardado en: ${outputPath}`);

  await prisma.$disconnect();
}

exportData().catch((e) => {
  console.error("Error exportando datos:", e);
  process.exit(1);
});