import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destinoId = searchParams.get("destinoId");
  const periodoId = searchParams.get("periodoId");
  if (!destinoId || !periodoId) return NextResponse.json([]);
  const data = await prisma.motivoViaje.findMany({
    where: { destinoId, periodoId },
    include: { destino: { select: { id: true, nombre: true } } },
    orderBy: { porcentaje: "desc" },
  });
  return NextResponse.json(data);
}