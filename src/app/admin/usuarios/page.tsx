import { getUsers } from "@/lib/actions/usuarios";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UsuariosTable } from "./usuarios-table";

export default async function UsuariosPage() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") redirect("/admin");

  const usuarios = await getUsers();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
      <UsuariosTable usuarios={usuarios} currentUserId={session.user.id} />
    </div>
  );
}