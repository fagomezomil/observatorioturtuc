import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const periodos = await prisma.periodo.findMany({ orderBy: [{ anio: "desc" }, { temporada: "asc" }] });
  return NextResponse.json(periodos);
}