"use client";

import { useState, useEffect } from "react";
import { ChartCard } from "@/components/public/chart-card";
import { LineChartComponent } from "@/components/charts/line-chart";
import { BarChartComponent } from "@/components/charts/bar-chart";
import { StatMetric } from "@/components/public/stat-metric";
import { EmptyState } from "@/components/public/empty-state";
import { Users, DollarSign, Bed, TrendingUp, Search } from "lucide-react";
import type { EvolutionChartData } from "@/lib/evolution-data";

type Indicator = "impacto" | "turistas" | "gasto" | "procedencia";

const indicators: { value: Indicator; label: string }[] = [
  { value: "impacto", label: "Impacto Económico" },
  { value: "turistas", label: "Cantidad de Turistas" },
  { value: "gasto", label: "Gasto Diario Promedio" },
  { value: "procedencia", label: "Procedencia" },
];

const unitMap: Record<Indicator, "$" | "personas" | "$" | "%"> = {
  impacto: "$",
  turistas: "personas",
  gasto: "$",
  procedencia: "%",
};

const titleMap: Record<Indicator, Record<"Verano" | "Invierno", string>> = {
  impacto: { Verano: "Impacto económico — Verano", Invierno: "Impacto económico — Invierno" },
  turistas: { Verano: "Turistas por destino — Verano", Invierno: "Turistas por destino — Invierno" },
  gasto: { Verano: "Gasto diario promedio — Verano", Invierno: "Gasto diario promedio — Invierno" },
  procedencia: { Verano: "Procedencia — Verano", Invierno: "Procedencia — Invierno" },
};

interface SeasonStats {
  nombre: string;
  turistas: number;
  impacto: number;
  ocupacion: number;
  gasto: number;
}

interface PeriodoInfo {
  id: string;
  anio: number;
  nombre: string;
}

interface EvolutionChartsSectionProps {
  veranoImpacto: EvolutionChartData;
  veranoTuristas: EvolutionChartData;
  veranoGasto: EvolutionChartData;
  veranoProcedencia: EvolutionChartData;
  inviernoImpacto: EvolutionChartData;
  inviernoTuristas: EvolutionChartData;
  inviernoGasto: EvolutionChartData;
  inviernoProcedencia: EvolutionChartData;
  allStats: Record<string, SeasonStats>;
  veranoPeriodos: PeriodoInfo[];
  inviernoPeriodos: PeriodoInfo[];
}

export function EvolutionChartsSection(props: EvolutionChartsSectionProps) {
  const [season, setSeason] = useState<"Verano" | "Invierno">("Verano");
  const [indicator, setIndicator] = useState<Indicator>("impacto");
  const [selectedAnio, setSelectedAnio] = useState<number | null>(null);

  const periodos = season === "Verano" ? props.veranoPeriodos : props.inviernoPeriodos;

  useEffect(() => {
    setSelectedAnio(periodos.length > 0 ? periodos[0].anio : null);
  }, [season, periodos.length]);

  const currentPeriodo = periodos.find((p) => p.anio === selectedAnio);
  const stats = currentPeriodo ? props.allStats[currentPeriodo.id] : null;

  const seasonData = season === "Verano"
    ? { impacto: props.veranoImpacto, turistas: props.veranoTuristas, gasto: props.veranoGasto, procedencia: props.veranoProcedencia }
    : { impacto: props.inviernoImpacto, turistas: props.inviernoTuristas, gasto: props.inviernoGasto, procedencia: props.inviernoProcedencia };

  const chartData = seasonData[indicator];
  const hasChartData = chartData.datasets.some((ds) => ds.data.some((v) => v !== null));

  const isProcedencia = indicator === "procedencia";
  const procedenciaBarData = isProcedencia && selectedAnio ? (() => {
    const yearIdx = chartData.labels.indexOf(String(selectedAnio));
    if (yearIdx === -1) return null;
    return {
      labels: chartData.datasets.map((ds) => ds.label),
      datasets: [{ label: "% Procedencia", data: chartData.datasets.map((ds) => ds.data[yearIdx] ?? 0) }],
    };
  })() : null;

  const fmtCurrency = (v: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-4">
          Evolución Temporal
        </h2>
        <p className="text-center text-muted-foreground mb-8 text-[13px]">
          Compare los indicadores turísticos a lo largo de los años
        </p>

        <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
          <div className="inline-flex rounded-[8px] border border-border bg-card p-1">
            <button
              onClick={() => setSeason("Verano")}
              className={`rounded-md px-5 py-1.5 text-sm font-medium transition-colors ${
                season === "Verano"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Verano
            </button>
            <button
              onClick={() => setSeason("Invierno")}
              className={`rounded-md px-5 py-1.5 text-sm font-medium transition-colors ${
                season === "Invierno"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Invierno
            </button>
          </div>

          <select
            value={indicator}
            onChange={(e) => setIndicator(e.target.value as Indicator)}
            className="rounded-[8px] border border-border bg-card px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {indicators.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {periodos.length > 0 && (
            <select
              value={selectedAnio ?? ""}
              onChange={(e) => setSelectedAnio(Number(e.target.value))}
              className="rounded-[8px] border border-border bg-card px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {periodos.map((p) => (
                <option key={p.id} value={p.anio}>
                  {p.anio}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          {/* Chart — 3/4 width on desktop */}
          <div className="min-w-0 lg:col-span-3 my-auto">
            {hasChartData && isProcedencia && procedenciaBarData && (
              <ChartCard height="lg">
                <BarChartComponent
                  labels={procedenciaBarData.labels}
                  datasets={procedenciaBarData.datasets}
                  title={titleMap[indicator][season]}
                  unit="%"
                  horizontal
                />
              </ChartCard>
            )}
            {hasChartData && !isProcedencia && (
              <ChartCard height="lg">
                <LineChartComponent
                  labels={chartData.labels}
                  datasets={chartData.datasets}
                  title={titleMap[indicator][season]}
                  unit={unitMap[indicator]}
                />
              </ChartCard>
            )}
            {!hasChartData && (
              <EmptyState
                icon={Search}
                title="Sin datos disponibles"
                description="No hay datos para esta combinación de temporada e indicador."
              />
            )}
          </div>

          {/* Stats — 1/4 width on desktop */}
          <div className="flex flex-col min-w-0 lg:self-stretch gap-4">
            {stats && (
              <>
                <div className="rounded-[8px] bg-[#006e66] px-4 py-2 text-sm font-semibold text-white text-center lg:text-left">
                  {stats.nombre}
                </div>
                <StatMetric
                  value={stats.turistas > 0 ? stats.turistas.toLocaleString("es-AR") : "—"}
                  label="Turistas registrados"
                  icon={Users}
                  accentColor="teal"
                  className="flex-1"
                />
                <StatMetric
                  value={stats.impacto > 0 ? fmtCurrency(stats.impacto) : "—"}
                  label="Impacto económico"
                  icon={DollarSign}
                  accentColor="navy"
                  className="flex-1"
                />
                <StatMetric
                  value={stats.ocupacion > 0 ? `${stats.ocupacion.toFixed(0)}%` : "—"}
                  label="Ocupación promedio"
                  icon={Bed}
                  className="flex-1"
                />
                <StatMetric
                  value={stats.gasto > 0 ? fmtCurrency(Math.round(stats.gasto)) : "—"}
                  label="Gasto diario promedio"
                  icon={TrendingUp}
                  accentColor="orange"
                  className="flex-1"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}