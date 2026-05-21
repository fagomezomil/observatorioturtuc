"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartCard } from "@/components/public/chart-card";
import { BarChartComponent } from "@/components/charts/bar-chart";
import { PieChartComponent } from "@/components/charts/pie-chart";
import { DoughnutChartComponent } from "@/components/charts/doughnut-chart";
import { DataSection } from "@/components/public/data-section";
import { MethodologyNote } from "@/components/public/methodology-note";
import { StatMetric } from "@/components/public/stat-metric";
import { ProfileCard } from "@/components/public/profile-card";
import { EmptyState } from "@/components/public/empty-state";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/charts";
import {
  Users, DollarSign, Bed, TrendingUp, MapPin,
} from "lucide-react";

type Destino = { id: string; nombre: string };
type RecordWithDestino = { destinoId: string; destino?: Destino; [key: string]: unknown };

interface BalanceContentProps {
  periodo: { id: string; nombre: string; temporada: string; anio: number };
  periodos: { id: string; nombre: string; temporada: string; anio: number }[];
  destinos: Destino[];
  procedencias: RecordWithDestino[];
  motivosViaje: RecordWithDestino[];
  rangosEdad: RecordWithDestino[];
  gastos: RecordWithDestino[];
  ocupaciones: RecordWithDestino[];
  perfiles: RecordWithDestino[];
  infosPrevia: RecordWithDestino[];
  sitiosConsultados: RecordWithDestino[];
  companiasViaje: RecordWithDestino[];
  anticipacionesViaje: RecordWithDestino[];
  estadias: RecordWithDestino[];
  actividades: RecordWithDestino[];
  movimientos: RecordWithDestino[];
  pernoctesExtra: RecordWithDestino[];
  impacto: { id: string; montoTotal: number; moneda: string; descripcion: string | null } | null;
  nota: { id: string; contenido: string } | null;
  previousPeriodoId: string | null;
  previousGastos: RecordWithDestino[];
  previousOcupaciones: RecordWithDestino[];
  previousMovimientos: RecordWithDestino[];
}

export function BalanceContent({
  periodo,
  periodos,
  destinos,
  procedencias,
  motivosViaje,
  rangosEdad,
  gastos,
  ocupaciones,
  perfiles,
  infosPrevia,
  sitiosConsultados,
  companiasViaje,
  anticipacionesViaje,
  estadias,
  actividades,
  movimientos,
  pernoctesExtra,
  impacto,
  nota,
  previousPeriodoId,
  previousGastos,
  previousOcupaciones,
  previousMovimientos,
}: BalanceContentProps) {
  const [selectedDestino, setSelectedDestino] = useState<string>("all");
  const router = useRouter();

  const filterByDestino = <T extends RecordWithDestino>(data: T[]) => {
    if (selectedDestino === "all") return data;
    return data.filter((d) => d.destinoId === selectedDestino);
  };

  const destinoNombre = (destinoId: string) =>
    destinos.find((d) => d.id === destinoId)?.nombre ?? destinoId;

  // Computed summary stats
  const totalTuristas = movimientos.reduce((s, m) => s + ((m as RecordWithDestino & { cantidadTuristas: number | null }).cantidadTuristas ?? 0), 0);
  const totalPernoctes = movimientos.reduce((s, m) => s + ((m as RecordWithDestino & { pernoctes: number | null }).pernoctes ?? 0), 0);
  const avgOcupacion = ocupaciones.length > 0
    ? ocupaciones.reduce((s, o) => s + ((o as RecordWithDestino & { ocupacionMensual: number | null }).ocupacionMensual ?? 0), 0) / ocupaciones.length
    : 0;
  const avgGasto = gastos.length > 0
    ? gastos.reduce((s, g) => s + ((g as RecordWithDestino & { gastoDiarioPorPersona: number }).gastoDiarioPorPersona), 0) / gastos.length
    : 0;
  const avgEstadia = estadias.length > 0
    ? estadias.reduce((s, e) => s + ((e as RecordWithDestino & { noches: number }).noches), 0) / estadias.length
    : 0;

  // Previous period comparison
  const prevTotalTuristas = previousMovimientos.reduce((s, m) => s + ((m as RecordWithDestino & { cantidadTuristas: number | null }).cantidadTuristas ?? 0), 0);
  const turistasChange = previousPeriodoId && totalTuristas > 0 && prevTotalTuristas > 0
    ? Math.round(((totalTuristas - prevTotalTuristas) / prevTotalTuristas) * 100)
    : undefined;
  const prevAvgOcupacion = previousOcupaciones.length > 0
    ? previousOcupaciones.reduce((s, o) => s + ((o as RecordWithDestino & { ocupacionMensual: number | null }).ocupacionMensual ?? 0), 0) / previousOcupaciones.length
    : 0;
  const ocupacionChange = previousPeriodoId && avgOcupacion > 0 && prevAvgOcupacion > 0
    ? Math.round(((avgOcupacion - prevAvgOcupacion) / prevAvgOcupacion) * 100)
    : undefined;

  const filteredProcedencias = filterByDestino(procedencias.filter((p) => (p as RecordWithDestino & { tipoTurista: string }).tipoTurista === "turista"));
  const filteredMotivos = filterByDestino(motivosViaje);
  const filteredRangos = filterByDestino(rangosEdad);
  const filteredGastos = filterByDestino(gastos);
  const filteredOcupaciones = filterByDestino(ocupaciones);
  const filteredPerfiles = filterByDestino(perfiles);
  const filteredInfos = filterByDestino(infosPrevia);
  const filteredSitios = filterByDestino(sitiosConsultados);
  const filteredCompanias = filterByDestino(companiasViaje);
  const filteredAnticipaciones = filterByDestino(anticipacionesViaje);
  const filteredEstadias = filterByDestino(estadias);
  const filteredActividades = filterByDestino(actividades);
  const filteredMovimientos = filterByDestino(movimientos);
  const filteredPernoctes = filterByDestino(pernoctesExtra);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-6">
        {/* Period selector */}
        <div className="flex items-center gap-3">
          <label className="text-[13px] font-medium text-muted-foreground">Período:</label>
          <select
            value={periodo.id}
            onChange={(e) => {
              const p = periodos.find((p) => p.id === e.target.value);
              if (p) {
                const slug = p.nombre.toLowerCase().replace(/\s+/g, "-");
                router.push(`/balance/${slug}`);
              }
            }}
            className="rounded-[8px] border border-border bg-card px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {periodos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Destino filter */}
        <div className="flex items-center gap-3">
          <label className="text-[13px] font-medium text-muted-foreground">Destino:</label>
          <select
            value={selectedDestino}
            onChange={(e) => setSelectedDestino(e.target.value)}
            className="rounded-[8px] border border-border bg-card px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos los destinos</option>
            {destinos.map((d) => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <Tabs defaultValue="resumen" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-2">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="perfil">Perfil Turista</TabsTrigger>
          <TabsTrigger value="gasto">Gasto y Economía</TabsTrigger>
          <TabsTrigger value="ocupacion">Ocupación y Movimiento</TabsTrigger>
          <TabsTrigger value="info">Info y Planificación</TabsTrigger>
          <TabsTrigger value="actividades">Actividades</TabsTrigger>
        </TabsList>

        {/* ─── RESUMEN ─── */}
        <TabsContent value="resumen" className="space-y-10">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatMetric value={formatNumber(totalTuristas)} label="Turistas" change={turistasChange} accentColor="teal" />
            <StatMetric
              value={impacto ? formatCurrency(impacto.montoTotal) : "—"}
              label="Impacto económico"
              accentColor="navy"
            />
            <StatMetric value={avgOcupacion > 0 ? formatPercent(avgOcupacion) : "—"} label="Ocupación promedio" change={ocupacionChange} suffix="%" />
            <StatMetric value={avgGasto > 0 ? formatCurrency(Math.round(avgGasto)) : "—"} label="Gasto diario promedio" prefix="$" accentColor="orange" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatMetric value={avgEstadia > 0 ? avgEstadia.toFixed(1) : "—"} label="Estadía promedio" suffix="noches" />
            <StatMetric value={destinos.length.toString()} label="Destinos con datos" icon={MapPin} />
            <StatMetric value={totalPernoctes > 0 ? formatNumber(totalPernoctes) : "—"} label="Pernoctaciones" />
          </div>
          {impacto && (
            <ProfileCard title="Impacto Económico" accent="navy">
              <p className="text-[28px] font-bold font-tabular text-[#223468]">
                {formatCurrency(impacto.montoTotal)}
              </p>
              {impacto.descripcion && <p className="text-[13px] text-muted-foreground mt-2">{impacto.descripcion}</p>}
            </ProfileCard>
          )}
          {nota && <MethodologyNote content={nota.contenido} />}
        </TabsContent>

        {/* ─── PERFIL DEL TURISTA ─── */}
        <TabsContent value="perfil" className="space-y-10">
          {/* Procedencia */}
          {filteredProcedencias.length > 0 ? (
            <DataSection title="Procedencia" description="Origen de los turistas que visitaron cada destino" variant="inset">
              <div className="grid gap-5 lg:grid-cols-2">
                {destinos.filter(d => selectedDestino === "all" || d.id === selectedDestino).map((destino) => {
                  const datos = procedencias.filter((p) => p.destinoId === destino.id && (p as RecordWithDestino & { tipoTurista: string }).tipoTurista === "turista");
                  if (datos.length === 0) return null;
                  const sorted = [...datos].sort((a, b) => ((b as RecordWithDestino & { porcentaje: number }).porcentaje) - ((a as RecordWithDestino & { porcentaje: number }).porcentaje));
                  return (
                    <ChartCard key={destino.id} title={destino.nombre} height="sm">
                      <BarChartComponent
                        labels={sorted.map((d) => (d as RecordWithDestino & { origen: string }).origen)}
                        datasets={[{ label: "% Turistas", data: sorted.map((d) => (d as RecordWithDestino & { porcentaje: number }).porcentaje) }]}
                        title={`¿De dónde vienen?`}
                        unit="%"
                      />
                    </ChartCard>
                  );
                })}
              </div>
            </DataSection>
          ) : (
            <EmptyState title="Sin datos de procedencia" description="No se registraron datos de procedencia para esta selección." />
          )}

          {/* Motivo de viaje */}
          {filteredMotivos.length > 0 ? (
            <DataSection title="Motivo de Viaje" description="Principales razones por las que los turistas eligieron el destino">
              <div className="grid gap-5 lg:grid-cols-2">
                {destinos.filter(d => selectedDestino === "all" || d.id === selectedDestino).map((destino) => {
                  const datos = motivosViaje.filter((m) => m.destinoId === destino.id);
                  if (datos.length === 0) return null;
                  return (
                    <ChartCard key={destino.id} title={destino.nombre} height="sm">
                      <DoughnutChartComponent
                        labels={datos.map((d) => (d as RecordWithDestino & { motivo: string }).motivo)}
                        data={datos.map((d) => (d as RecordWithDestino & { porcentaje: number }).porcentaje)}
                        title={`¿Por qué eligieron ${destino.nombre}?`}
                      />
                    </ChartCard>
                  );
                })}
              </div>
            </DataSection>
          ) : null}

          {/* Rango de edades */}
          {filteredRangos.length > 0 ? (
            <DataSection title="Rango de Edades" description="Distribución etaria de los visitantes" variant="inset">
              <div className="grid gap-5 lg:grid-cols-2">
                {destinos.filter(d => selectedDestino === "all" || d.id === selectedDestino).map((destino) => {
                  const datos = rangosEdad.filter((r) => r.destinoId === destino.id);
                  if (datos.length === 0) return null;
                  return (
                    <ChartCard key={destino.id} title={destino.nombre} height="sm">
                      <PieChartComponent
                        labels={datos.map((d) => (d as RecordWithDestino & { rango: string }).rango)}
                        data={datos.map((d) => (d as RecordWithDestino & { porcentaje: number }).porcentaje)}
                        title={`Edades — ${destino.nombre}`}
                      />
                    </ChartCard>
                  );
                })}
              </div>
            </DataSection>
          ) : null}

          {/* Compañía de viaje */}
          {filteredCompanias.length > 0 ? (
            <DataSection title="Compañía de Viaje" description="Con quién viajan los turistas">
              <div className="grid gap-5 lg:grid-cols-2">
                {destinos.filter(d => selectedDestino === "all" || d.id === selectedDestino).map((destino) => {
                  const datos = companiasViaje.filter((c) => c.destinoId === destino.id);
                  if (datos.length === 0) return null;
                  return (
                    <ChartCard key={destino.id} title={destino.nombre} height="sm">
                      <DoughnutChartComponent
                        labels={datos.map((d) => (d as RecordWithDestino & { tipo: string }).tipo)}
                        data={datos.map((d) => (d as RecordWithDestino & { porcentaje: number }).porcentaje)}
                      />
                    </ChartCard>
                  );
                })}
              </div>
            </DataSection>
          ) : null}

          {/* Perfil resumen */}
          {filteredPerfiles.length > 0 ? (
            <DataSection title="Perfil del Turista" description="Resumen de datos clave del perfil turístico" variant="inset">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPerfiles.map((p) => (
                  <ProfileCard key={(p as RecordWithDestino & { id: string }).id} title={(p as RecordWithDestino & { destino: Destino }).destino?.nombre ?? ""} accent="teal">
                    <div className="space-y-2 text-[13px]">
                      {(p as RecordWithDestino & { porcentajePrimeraVez: number | null }).porcentajePrimeraVez !== null && (
                        <p>Primera vez: <span className="font-semibold">{(p as RecordWithDestino & { porcentajePrimeraVez: number | null }).porcentajePrimeraVez}%</span></p>
                      )}
                      {(p as RecordWithDestino & { porcentajeArgentinos: number | null }).porcentajeArgentinos !== null && (
                        <p>Argentinos: <span className="font-semibold">{(p as RecordWithDestino & { porcentajeArgentinos: number | null }).porcentajeArgentinos}%</span></p>
                      )}
                      {(p as RecordWithDestino & { encuestasRealizadas: number | null }).encuestasRealizadas !== null && (
                        <p>Encuestas: <span className="font-semibold">{(p as RecordWithDestino & { encuestasRealizadas: number | null }).encuestasRealizadas}</span></p>
                      )}
                    </div>
                  </ProfileCard>
                ))}
              </div>
            </DataSection>
          ) : null}
        </TabsContent>

        {/* ─── GASTO Y ECONOMÍA ─── */}
        <TabsContent value="gasto" className="space-y-10">
          {filteredGastos.length > 0 ? (
            <DataSection title="Gasto Promedio Diario" description="Gasto promedio por día por persona en cada destino">
              <div className="grid gap-5 lg:grid-cols-2">
                <ChartCard title="Gasto diario por destino" height="sm">
                  <BarChartComponent
                    labels={filteredGastos.map((g) => (g as RecordWithDestino & { destino: Destino }).destino?.nombre ?? "")}
                    datasets={[{ label: "Gasto diario ($)", data: filteredGastos.map((g) => (g as RecordWithDestino & { gastoDiarioPorPersona: number }).gastoDiarioPorPersona) }]}
                    unit="$"
                  />
                </ChartCard>
                {filteredGastos.some((g) => (g as RecordWithDestino & { porcentajeAlojamiento: number | null }).porcentajeAlojamiento !== null) && (
                  <ChartCard title="Distribución del gasto (promedio)" height="sm">
                    <DoughnutChartComponent
                      labels={["Alojamiento", "Gastronomía", "Transporte", "Excursiones", "Compras"]}
                      data={[
                        filteredGastos.reduce((s, g) => s + ((g as RecordWithDestino & { porcentajeAlojamiento: number | null }).porcentajeAlojamiento ?? 0), 0) / filteredGastos.length,
                        filteredGastos.reduce((s, g) => s + ((g as RecordWithDestino & { porcentajeGastronomia: number | null }).porcentajeGastronomia ?? 0), 0) / filteredGastos.length,
                        filteredGastos.reduce((s, g) => s + ((g as RecordWithDestino & { porcentajeTransporte: number | null }).porcentajeTransporte ?? 0), 0) / filteredGastos.length,
                        filteredGastos.reduce((s, g) => s + ((g as RecordWithDestino & { porcentajeExcursiones: number | null }).porcentajeExcursiones ?? 0), 0) / filteredGastos.length,
                        filteredGastos.reduce((s, g) => s + ((g as RecordWithDestino & { porcentajeCompras: number | null }).porcentajeCompras ?? 0), 0) / filteredGastos.length,
                      ]}
                      centerText={formatCurrency(Math.round(filteredGastos.reduce((s, g) => s + (g as RecordWithDestino & { gastoDiarioPorPersona: number }).gastoDiarioPorPersona, 0) / filteredGastos.length))}
                      centerLabel="promedio/día"
                    />
                  </ChartCard>
                )}
              </div>
            </DataSection>
          ) : null}

          {/* Estadía promedio */}
          {filteredEstadias.length > 0 ? (
            <DataSection title="Estadía Promedio" description="Cantidad promedio de noches por destino" variant="inset">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredEstadias.map((e) => (
                  <ProfileCard key={(e as RecordWithDestino & { id: string }).id} title={(e as RecordWithDestino & { destino: Destino }).destino?.nombre ?? ""} accent="orange">
                    <p className="text-[28px] font-bold font-tabular text-[#e9721f]">
                      {(e as RecordWithDestino & { noches: number }).noches}
                      <span className="text-base font-normal text-muted-foreground ml-1">noches</span>
                    </p>
                    {(e as RecordWithDestino & { variacionInteranual: number | null }).variacionInteranual !== null && (e as RecordWithDestino & { variacionInteranual: number | null }).variacionInteranual !== undefined && (
                      <p className="text-[13px] mt-1">
                        <span className={`font-medium ${(e as RecordWithDestino & { variacionInteranual: number }).variacionInteranual >= 0 ? "trend-up" : "trend-down"}`}>
                          {(e as RecordWithDestino & { variacionInteranual: number }).variacionInteranual >= 0 ? "+" : ""}{(e as RecordWithDestino & { variacionInteranual: number }).variacionInteranual}% interanual
                        </span>
                      </p>
                    )}
                  </ProfileCard>
                ))}
              </div>
            </DataSection>
          ) : null}

          {impacto && (
            <DataSection title="Impacto Económico">
              <ProfileCard title={formatCurrency(impacto.montoTotal)} accent="navy">
                {impacto.descripcion && <p className="text-[13px] text-muted-foreground">{impacto.descripcion}</p>}
              </ProfileCard>
            </DataSection>
          )}
        </TabsContent>

        {/* ─── OCUPACIÓN Y MOVIMIENTO ─── */}
        <TabsContent value="ocupacion" className="space-y-10">
          {filteredOcupaciones.length > 0 ? (
            <DataSection title="Ocupación Hotelera" description="Porcentaje de ocupación hotelera y parahotelera por destino">
              <ChartCard height="md">
                <BarChartComponent
                  labels={filteredOcupaciones.map((o) => (o as RecordWithDestino & { destino: Destino }).destino?.nombre ?? "")}
                  datasets={[{ label: "Ocupación mensual (%)", data: filteredOcupaciones.map((o) => (o as RecordWithDestino & { ocupacionMensual: number | null }).ocupacionMensual ?? 0) }]}
                  unit="%"
                />
              </ChartCard>
            </DataSection>
          ) : null}

          {filteredMovimientos.length > 0 ? (
            <DataSection title="Movimiento de Turistas" description="Cantidad de turistas y pernoctaciones por destino" variant="inset">
              <div className="grid gap-5 lg:grid-cols-2">
                <ChartCard title="Turistas por destino" height="sm">
                  <BarChartComponent
                    labels={filteredMovimientos.filter(m => (m as RecordWithDestino & { tipo: string }).tipo === "turista").map((m) => (m as RecordWithDestino & { destino: Destino }).destino?.nombre ?? "")}
                    datasets={[{ label: "Turistas", data: filteredMovimientos.filter(m => (m as RecordWithDestino & { tipo: string }).tipo === "turista").map((m) => (m as RecordWithDestino & { cantidadTuristas: number | null }).cantidadTuristas ?? 0) }]}
                    unit="personas"
                  />
                </ChartCard>
                {filteredMovimientos.some(m => (m as RecordWithDestino & { pernoctes: number | null }).pernoctes !== null) && (
                  <ChartCard title="Pernoctaciones por destino" height="sm">
                    <BarChartComponent
                      labels={filteredMovimientos.map((m) => (m as RecordWithDestino & { destino: Destino }).destino?.nombre ?? "")}
                      datasets={[{ label: "Pernoctaciones", data: filteredMovimientos.map((m) => (m as RecordWithDestino & { pernoctes: number | null }).pernoctes ?? 0) }]}
                      unit="personas"
                    />
                  </ChartCard>
                )}
              </div>
            </DataSection>
          ) : null}

          {filteredPernoctes.length > 0 ? (
            <DataSection title="Pernoctes Extra Hoteleros" description="Pernoctaciones en casas de familiares y amigos">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPernoctes.map((p) => (
                  <ProfileCard key={(p as RecordWithDestino & { id: string }).id} title={(p as RecordWithDestino & { destino: Destino }).destino?.nombre ?? ""} accent="teal">
                    {(p as RecordWithDestino & { pernoctes: number | null }).pernoctes !== null && (
                      <p className="text-2xl font-bold font-tabular text-[#006e66]">{formatNumber((p as RecordWithDestino & { pernoctes: number }).pernoctes ?? 0)}</p>
                    )}
                    {(p as RecordWithDestino & { descripcion: string | null }).descripcion && (
                      <p className="text-[13px] text-muted-foreground mt-1">{(p as RecordWithDestino & { descripcion: string }).descripcion}</p>
                    )}
                  </ProfileCard>
                ))}
              </div>
            </DataSection>
          ) : null}
        </TabsContent>

        {/* ─── INFO Y PLANIFICACIÓN ─── */}
        <TabsContent value="info" className="space-y-10">
          {filteredInfos.length > 0 ? (
            <DataSection title="Información Previa" description="Dónde buscaron información los turistas antes de viajar" variant="inset">
              <div className="grid gap-5 lg:grid-cols-2">
                {destinos.filter(d => selectedDestino === "all" || d.id === selectedDestino).map((destino) => {
                  const datos = infosPrevia.filter((i) => i.destinoId === destino.id);
                  if (datos.length === 0) return null;
                  return (
                    <ChartCard key={destino.id} title={destino.nombre} height="sm">
                      <DoughnutChartComponent
                        labels={datos.map((d) => (d as RecordWithDestino & { fuente: string }).fuente)}
                        data={datos.map((d) => (d as RecordWithDestino & { porcentaje: number }).porcentaje)}
                      />
                    </ChartCard>
                  );
                })}
              </div>
            </DataSection>
          ) : null}

          {filteredSitios.length > 0 ? (
            <DataSection title="Sitios Consultados" description="Qué sitios web consultaron los turistas">
              <div className="grid gap-5 lg:grid-cols-2">
                {destinos.filter(d => selectedDestino === "all" || d.id === selectedDestino).map((destino) => {
                  const datos = sitiosConsultados.filter((s) => s.destinoId === destino.id);
                  if (datos.length === 0) return null;
                  return (
                    <ChartCard key={destino.id} title={destino.nombre} height="sm">
                      <BarChartComponent
                        labels={datos.map((d) => (d as RecordWithDestino & { sitio: string }).sitio)}
                        datasets={[{ label: "% consulta", data: datos.map((d) => (d as RecordWithDestino & { porcentaje: number }).porcentaje) }]}
                        unit="%"
                        horizontal
                      />
                    </ChartCard>
                  );
                })}
              </div>
            </DataSection>
          ) : null}

          {filteredAnticipaciones.length > 0 ? (
            <DataSection title="Anticipación del Viaje" description="Con cuánto tiempo planificaron su viaje los turistas" variant="inset">
              <div className="grid gap-5 lg:grid-cols-2">
                {destinos.filter(d => selectedDestino === "all" || d.id === selectedDestino).map((destino) => {
                  const datos = anticipacionesViaje.filter((a) => a.destinoId === destino.id);
                  if (datos.length === 0) return null;
                  return (
                    <ChartCard key={destino.id} title={destino.nombre} height="sm">
                      <BarChartComponent
                        labels={datos.map((d) => (d as RecordWithDestino & { categoria: string }).categoria)}
                        datasets={[{ label: "% turistas", data: datos.map((d) => (d as RecordWithDestino & { porcentaje: number }).porcentaje) }]}
                        unit="%"
                        horizontal
                      />
                    </ChartCard>
                  );
                })}
              </div>
            </DataSection>
          ) : null}
        </TabsContent>

        {/* ─── ACTIVIDADES ─── */}
        <TabsContent value="actividades" className="space-y-10">
          {filteredActividades.length > 0 ? (
            <DataSection title="Actividades Realizadas" description="Qué actividades realizaron los turistas durante su estadía">
              <div className="grid gap-5 lg:grid-cols-2">
                {destinos.filter(d => selectedDestino === "all" || d.id === selectedDestino).map((destino) => {
                  const datos = actividades.filter((a) => a.destinoId === destino.id);
                  if (datos.length === 0) return null;
                  return (
                    <ChartCard key={destino.id} title={destino.nombre} height="md">
                      <BarChartComponent
                        labels={datos.map((d) => (d as RecordWithDestino & { actividad: string }).actividad)}
                        datasets={[{ label: "% turistas", data: datos.map((d) => (d as RecordWithDestino & { porcentaje: number }).porcentaje) }]}
                        unit="%"
                        horizontal
                      />
                    </ChartCard>
                  );
                })}
              </div>
            </DataSection>
          ) : (
            <EmptyState title="Sin datos de actividades" description="No se registraron datos de actividades para esta selección." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}