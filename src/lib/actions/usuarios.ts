"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
}

export async function updateUserRole(userId: string, role: "ADMIN" | "EDITOR" | "VIEWER") {
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/usuarios");
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/usuarios");
}