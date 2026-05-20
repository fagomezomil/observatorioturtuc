"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// === Ocupación Hotelera ===
export async function getOcupaciones(destinoId: string, periodoId: string) {
  return prisma.ocupacionHotelera.findUnique({ where: { destinoId_periodoId: { destinoId, periodoId } } });
}

export async function createOcupacion(data: { destinoId: string; periodoId: string; ocupacionMensual?: number; ocupacionDiaria?: number; notas?: string }) {
  const record = await prisma.ocupacionHotelera.create({ data });
  revalidatePath("/admin/ocupacion");
  return record;
}

export async function updateOcupacion(id: string, data: { ocupacionMensual?: number; ocupacionDiaria?: number; notas?: string }) {
  const record = await prisma.ocupacionHotelera.update({ where: { id }, data });
  revalidatePath("/admin/ocupacion");
  return record;
}

export async function deleteOcupacion(id: string) {
  await prisma.ocupacionHotelera.delete({ where: { id } });
  revalidatePath("/admin/ocupacion");
}

// === Perfil Turista ===
export async function getPerfiles(destinoId: string, periodoId: string) {
  return prisma.perfilTurista.findUnique({ where: { destinoId_periodoId: { destinoId, periodoId } } });
}

export async function createPerfil(data: { destinoId: string; periodoId: string; porcentajePrimeraVez?: number; encuestasRealizadas?: number; porcentajeArgentinos?: number; porcentajeExtranjeros?: number; porcentajeVisitoAntes?: number; porcentajeNoVisitoAntes?: number }) {
  const record = await prisma.perfilTurista.create({ data });
  revalidatePath("/admin/perfil");
  return record;
}

export async function updatePerfil(id: string, data: Record<string, unknown>) {
  const record = await prisma.perfilTurista.update({ where: { id }, data });
  revalidatePath("/admin/perfil");
  return record;
}

export async function deletePerfil(id: string) {
  await prisma.perfilTurista.delete({ where: { id } });
  revalidatePath("/admin/perfil");
}

// === Procedencia ===
export async function getProcedencias(destinoId: string, periodoId: string) {
  return prisma.procedencia.findMany({ where: { destinoId, periodoId }, orderBy: { porcentaje: "desc" } });
}

export async function createProcedencia(data: { destinoId: string; periodoId: string; origen: string; porcentaje: number; tipoTurista?: string; ranking?: number }) {
  const record = await prisma.procedencia.create({ data });
  revalidatePath("/admin/procedencia");
  return record;
}

export async function deleteProcedencia(id: string) {
  await prisma.procedencia.delete({ where: { id } });
  revalidatePath("/admin/procedencia");
}

// === Motivo Viaje ===
export async function getMotivosViaje(destinoId: string, periodoId: string) {
  return prisma.motivoViaje.findMany({ where: { destinoId, periodoId }, orderBy: { porcentaje: "desc" } });
}

export async function createMotivoViaje(data: { destinoId: string; periodoId: string; motivo: string; porcentaje: number }) {
  const record = await prisma.motivoViaje.create({ data });
  revalidatePath("/admin/motivos");
  return record;
}

export async function deleteMotivoViaje(id: string) {
  await prisma.motivoViaje.delete({ where: { id } });
  revalidatePath("/admin/motivos");
}

// === Rango Edad ===
export async function getRangosEdad(destinoId: string, periodoId: string) {
  return prisma.rangoEdad.findMany({ where: { destinoId, periodoId } });
}

export async function createRangoEdad(data: { destinoId: string; periodoId: string; rango: string; porcentaje: number }) {
  const record = await prisma.rangoEdad.create({ data });
  revalidatePath("/admin/rangos-edad");
  return record;
}

export async function deleteRangoEdad(id: string) {
  await prisma.rangoEdad.delete({ where: { id } });
  revalidatePath("/admin/rangos-edad");
}

// === Info Previa ===
export async function getInfosPrevia(destinoId: string, periodoId: string) {
  return prisma.infoPrevia.findMany({ where: { destinoId, periodoId } });
}

export async function createInfoPrevia(data: { destinoId: string; periodoId: string; fuente: string; porcentaje: number }) {
  const record = await prisma.infoPrevia.create({ data });
  revalidatePath("/admin/info-previa");
  return record;
}

export async function deleteInfoPrevia(id: string) {
  await prisma.infoPrevia.delete({ where: { id } });
  revalidatePath("/admin/info-previa");
}

// === Sitio Consultado ===
export async function getSitiosConsultados(destinoId: string, periodoId: string) {
  return prisma.sitioConsultado.findMany({ where: { destinoId, periodoId } });
}

export async function createSitioConsultado(data: { destinoId: string; periodoId: string; sitio: string; porcentaje: number }) {
  const record = await prisma.sitioConsultado.create({ data });
  revalidatePath("/admin/sitios");
  return record;
}

export async function deleteSitioConsultado(id: string) {
  await prisma.sitioConsultado.delete({ where: { id } });
  revalidatePath("/admin/sitios");
}

// === Compañía Viaje ===
export async function getCompaniasViaje(destinoId: string, periodoId: string) {
  return prisma.companiaViaje.findMany({ where: { destinoId, periodoId } });
}

export async function createCompaniaViaje(data: { destinoId: string; periodoId: string; tipo: string; porcentaje: number }) {
  const record = await prisma.companiaViaje.create({ data });
  revalidatePath("/admin/compania");
  return record;
}

export async function deleteCompaniaViaje(id: string) {
  await prisma.companiaViaje.delete({ where: { id } });
  revalidatePath("/admin/compania");
}

// === Anticipación Viaje ===
export async function getAnticipaciones(destinoId: string, periodoId: string) {
  return prisma.anticipacionViaje.findMany({ where: { destinoId, periodoId } });
}

export async function createAnticipacion(data: { destinoId: string; periodoId: string; categoria: string; porcentaje: number }) {
  const record = await prisma.anticipacionViaje.create({ data });
  revalidatePath("/admin/anticipacion");
  return record;
}

export async function deleteAnticipacion(id: string) {
  await prisma.anticipacionViaje.delete({ where: { id } });
  revalidatePath("/admin/anticipacion");
}

// === Estadía Promedio ===
export async function getEstadias(destinoId: string, periodoId: string) {
  return prisma.estadiaPromedio.findUnique({ where: { destinoId_periodoId: { destinoId, periodoId } } });
}

export async function createEstadia(data: { destinoId: string; periodoId: string; noches: number; variacionInteranual?: number }) {
  const record = await prisma.estadiaPromedio.create({ data });
  revalidatePath("/admin/estadia");
  return record;
}

export async function updateEstadia(id: string, data: Record<string, unknown>) {
  const record = await prisma.estadiaPromedio.update({ where: { id }, data });
  revalidatePath("/admin/estadia");
  return record;
}

export async function deleteEstadia(id: string) {
  await prisma.estadiaPromedio.delete({ where: { id } });
  revalidatePath("/admin/estadia");
}

// === Gasto Promedio ===
export async function getGastos(destinoId: string, periodoId: string) {
  return prisma.gastoPromedio.findUnique({ where: { destinoId_periodoId: { destinoId, periodoId } } });
}

export async function createGasto(data: { destinoId: string; periodoId: string; gastoDiarioPorPersona: number; moneda?: string; grupoPromedio?: number; porcentajeAlojamiento?: number; porcentajeGastronomia?: number; porcentajeTransporte?: number; porcentajeExcursiones?: number; porcentajeCompras?: number }) {
  const record = await prisma.gastoPromedio.create({ data });
  revalidatePath("/admin/gasto");
  return record;
}

export async function updateGasto(id: string, data: Record<string, unknown>) {
  const record = await prisma.gastoPromedio.update({ where: { id }, data });
  revalidatePath("/admin/gasto");
  return record;
}

export async function deleteGasto(id: string) {
  await prisma.gastoPromedio.delete({ where: { id } });
  revalidatePath("/admin/gasto");
}

// === Actividades ===
export async function getActividades(destinoId: string, periodoId: string) {
  return prisma.actividad.findMany({ where: { destinoId, periodoId }, orderBy: { porcentaje: "desc" } });
}

export async function createActividad(data: { destinoId: string; periodoId: string; actividad: string; porcentaje: number }) {
  const record = await prisma.actividad.create({ data });
  revalidatePath("/admin/actividades");
  return record;
}

export async function deleteActividad(id: string) {
  await prisma.actividad.delete({ where: { id } });
  revalidatePath("/admin/actividades");
}

// === Movimiento Turistas ===
export async function getMovimientos(destinoId: string, periodoId: string) {
  return prisma.movimientoTurista.findMany({ where: { destinoId, periodoId } });
}

export async function createMovimiento(data: { destinoId: string; periodoId: string; cantidadTuristas?: number; pernoctes?: number; tipo?: string }) {
  const record = await prisma.movimientoTurista.create({ data });
  revalidatePath("/admin/movimiento");
  return record;
}

export async function deleteMovimiento(id: string) {
  await prisma.movimientoTurista.delete({ where: { id } });
  revalidatePath("/admin/movimiento");
}

// === Pernocte Extra Hotelero ===
export async function getPernoctesExtra(destinoId: string, periodoId: string) {
  return prisma.pernocteExtraHotelero.findUnique({ where: { destinoId_periodoId: { destinoId, periodoId } } });
}

export async function createPernocteExtra(data: { destinoId: string; periodoId: string; pernoctes?: number; porcentaje?: number; descripcion?: string }) {
  const record = await prisma.pernocteExtraHotelero.create({ data });
  revalidatePath("/admin/pernoctes");
  return record;
}

export async function deletePernocteExtra(id: string) {
  await prisma.pernocteExtraHotelero.delete({ where: { id } });
  revalidatePath("/admin/pernoctes");
}

// === Impacto Económico ===
export async function getImpactos(periodoId: string) {
  return prisma.impactoEconomico.findMany({ where: { periodoId } });
}

export async function createImpacto(data: { periodoId: string; montoTotal: number; moneda?: string; descripcion?: string }) {
  const record = await prisma.impactoEconomico.create({ data });
  revalidatePath("/admin/impacto");
  return record;
}

export async function deleteImpacto(id: string) {
  await prisma.impactoEconomico.delete({ where: { id } });
  revalidatePath("/admin/impacto");
}

// === Notas Metodológicas ===
export async function getNotas(periodoId: string) {
  return prisma.notaMetodologica.findUnique({ where: { periodoId } });
}

export async function createNota(data: { periodoId: string; contenido: string }) {
  const record = await prisma.notaMetodologica.create({ data });
  revalidatePath("/admin/notas");
  return record;
}

export async function updateNota(id: string, data: { contenido: string }) {
  const record = await prisma.notaMetodologica.update({ where: { id }, data });
  revalidatePath("/admin/notas");
  return record;
}

export async function deleteNota(id: string) {
  await prisma.notaMetodologica.delete({ where: { id } });
  revalidatePath("/admin/notas");
}