"use client";

import { updateUserRole } from "@/lib/actions/usuarios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Usuario {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

export function UsuariosTable({ usuarios, currentUserId }: { usuarios: Usuario[]; currentUserId: string }) {
  const handleRoleChange = async (userId: string, role: string) => {
    await updateUserRole(userId, role as "ADMIN" | "EDITOR" | "VIEWER");
  };

  const roleBadge = (role: string) => {
    switch (role) {
      case "ADMIN": return <Badge className="bg-red-500">Admin</Badge>;
      case "EDITOR": return <Badge className="bg-blue-500">Editor</Badge>;
      default: return <Badge variant="secondary">Viewer</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Fecha registro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell className="font-medium">{usuario.name || "—"}</TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>
                {usuario.id === currentUserId ? (
                  roleBadge(usuario.role)
                ) : (
                  <Select value={usuario.role} onValueChange={(value) => handleRoleChange(usuario.id, value ?? "VIEWER")}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="EDITOR">Editor</SelectItem>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
              <TableCell>{new Date(usuario.createdAt).toLocaleDateString("es-AR")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}