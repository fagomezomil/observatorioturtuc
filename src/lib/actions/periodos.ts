"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPeriodos() {
  return prisma.periodo.findMany({ orderBy: [{ anio: "desc" }, { temporada: "asc" }] });
}

export async function createPeriodo(data: { temporada: string; mes?: string; anio: number; nombre: string }) {
  const periodo = await prisma.periodo.create({ data });
  revalidatePath("/admin/periodos");
  return periodo;
}

export async function updatePeriodo(id: string, data: { temporada: string; mes?: string; anio: number; nombre: string }) {
  const periodo = await prisma.periodo.update({ where: { id }, data });
  revalidatePath("/admin/periodos");
  return periodo;
}

export async function deletePeriodo(id: string) {
  await prisma.periodo.delete({ where: { id } });
  revalidatePath("/admin/periodos");
}