import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const destinos = await prisma.destino.findMany({ orderBy: { nombre: "asc" } });
  return NextResponse.json(destinos);
}