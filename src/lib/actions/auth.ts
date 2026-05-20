"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function registerUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe un usuario con ese email" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "VIEWER",
    },
  });

  return { id: user.id, email: user.email };
}

export async function updateUserRole(userId: string, role: "ADMIN" | "EDITOR" | "VIEWER") {
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}