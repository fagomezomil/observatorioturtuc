import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const periodoId = searchParams.get("periodoId");
  if (!periodoId) return NextResponse.json([]);
  const data = await prisma.impactoEconomico.findMany({
    where: { periodoId },
    include: { periodo: { select: { id: true, nombre: true } } },
  });
  return NextResponse.json(data);
}