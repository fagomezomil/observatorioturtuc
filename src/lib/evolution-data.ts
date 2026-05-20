export type EvolutionChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: (number | null)[];
  }[];
};

type PeriodoInfo = {
  id: string;
  anio: number;
  temporada: string;
  nombre: string;
};

type DestinoInfo = {
  id: string;
  nombre: string;
};

function filterPeriodos(
  periodos: PeriodoInfo[],
  temporada: string
): PeriodoInfo[] {
  return periodos
    .filter((p) => p.temporada === temporada)
    .sort((a, b) => a.anio - b.anio);
}

export function shapeImpactoEconomico(
  impactos: { montoTotal: number; periodo: PeriodoInfo }[],
  temporada: "Verano" | "Invierno"
): EvolutionChartData {
  const periods = filterPeriodos(
    [...new Map(impactos.map((i) => [i.periodo.id, i.periodo])).values()],
    temporada
  );
  const labels = periods.map((p) => String(p.anio));

  const valueMap = new Map<string, number>();
  for (const imp of impactos) {
    if (imp.periodo.temporada === temporada) {
      valueMap.set(imp.periodo.id, imp.montoTotal);
    }
  }

  return {
    labels,
    datasets: [
      {
        label: "Impacto Económico",
        data: periods.map((p) => valueMap.get(p.id) ?? null),
      },
    ],
  };
}

export function shapeDestinoMetric(
  records: {
    destinoId: string;
    destino: DestinoInfo;
    periodoId: string;
    periodo: PeriodoInfo;
    [key: string]: unknown;
  }[],
  valueField: string,
  allPeriodos: PeriodoInfo[],
  allDestinos: DestinoInfo[],
  temporada: "Verano" | "Invierno"
): EvolutionChartData {
  const periods = filterPeriodos(allPeriodos, temporada);
  const labels = periods.map((p) => String(p.anio));
  const periodIds = new Set(periods.map((p) => p.id));

  const valueMap = new Map<string, number>();
  for (const r of records) {
    if (periodIds.has(r.periodoId)) {
      valueMap.set(
        `${r.destinoId}-${r.periodoId}`,
        r[valueField] as number
      );
    }
  }

  const destinosWithData = allDestinos.filter((d) =>
    periods.some((p) => valueMap.has(`${d.id}-${p.id}`))
  );

  return {
    labels,
    datasets: destinosWithData.map((d) => ({
      label: d.nombre,
      data: periods.map((p) => valueMap.get(`${d.id}-${p.id}`) ?? null),
    })),
  };
}

export function shapeMovimientoTurista(
  records: {
    destinoId: string;
    destino: DestinoInfo;
    periodoId: string;
    periodo: PeriodoInfo;
    cantidadTuristas: number | null;
    tipo: string;
  }[],
  allPeriodos: PeriodoInfo[],
  allDestinos: DestinoInfo[],
  temporada: "Verano" | "Invierno"
): EvolutionChartData {
  const periods = filterPeriodos(allPeriodos, temporada);
  const labels = periods.map((p) => String(p.anio));
  const periodIds = new Set(periods.map((p) => p.id));

  const sumMap = new Map<string, number>();
  for (const r of records) {
    if (
      r.tipo === "turista" &&
      periodIds.has(r.periodoId) &&
      r.cantidadTuristas !== null
    ) {
      const key = `${r.destinoId}-${r.periodoId}`;
      sumMap.set(key, (sumMap.get(key) ?? 0) + r.cantidadTuristas);
    }
  }

  const destinosWithData = allDestinos.filter((d) =>
    periods.some((p) => sumMap.has(`${d.id}-${p.id}`))
  );

  return {
    labels,
    datasets: destinosWithData.map((d) => ({
      label: d.nombre,
      data: periods.map((p) => sumMap.get(`${d.id}-${p.id}`) ?? null),
    })),
  };
}

export function shapeProcedencia(
  records: {
    destinoId: string;
    periodoId: string;
    origen: string;
    porcentaje: number;
    tipoTurista: string | null;
  }[],
  allPeriodos: PeriodoInfo[],
  temporada: "Verano" | "Invierno"
): EvolutionChartData {
  const periods = filterPeriodos(allPeriodos, temporada);
  const labels = periods.map((p) => String(p.anio));
  const periodIds = new Set(periods.map((p) => p.id));

  // Sum porcentaje per (origen, periodoId) for turista type, across all destinations
  const sumMap = new Map<string, number>();
  for (const r of records) {
    if (r.tipoTurista === "turista" && periodIds.has(r.periodoId)) {
      const key = `${r.origen}||${r.periodoId}`;
      sumMap.set(key, (sumMap.get(key) ?? 0) + r.porcentaje);
    }
  }

  // Collect all origenes that have data in this season
  const origenes = [
    ...new Set(
      records
        .filter((r) => r.tipoTurista === "turista" && periodIds.has(r.periodoId))
        .map((r) => r.origen)
    ),
  ].sort();

  return {
    labels,
    datasets: origenes.map((origen) => ({
      label: origen,
      data: periods.map((p) => sumMap.get(`${origen}||${p.id}`) ?? null),
    })),
  };
}

export function hasData(chart: EvolutionChartData): boolean {
  return chart.datasets.some((ds) => ds.data.some((v) => v !== null));
}