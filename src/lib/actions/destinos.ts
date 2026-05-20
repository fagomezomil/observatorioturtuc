"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDestinos() {
  return prisma.destino.findMany({ orderBy: { nombre: "asc" } });
}

export async function createDestino(data: { nombre: string }) {
  const destino = await prisma.destino.create({ data });
  revalidatePath("/admin/destinos");
  return destino;
}

export async function updateDestino(id: string, data: { nombre: string }) {
  const destino = await prisma.destino.update({ where: { id }, data });
  revalidatePath("/admin/destinos");
  return destino;
}

export async function deleteDestino(id: string) {
  await prisma.destino.delete({ where: { id } });
  revalidatePath("/admin/destinos");
}