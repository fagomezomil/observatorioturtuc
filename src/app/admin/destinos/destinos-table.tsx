"use client";

import { useState } from "react";
import { createDestino, deleteDestino } from "@/lib/actions/destinos";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface Destino {
  id: string;
  nombre: string;
  createdAt: Date;
}

export function DestinosTable({ destinos }: { destinos: Destino[] }) {
  const [nombre, setNombre] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreate = async () => {
    if (!nombre.trim()) return;
    await createDestino({ nombre: nombre.trim() });
    setNombre("");
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Está seguro de eliminar este destino?")) {
      await deleteDestino(id);
    }
  };

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button />}>
          <Plus className="mr-2 h-4 w-4" />Nuevo destino
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Nuevo destino</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Nombre del destino" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <Button onClick={handleCreate} className="w-full">Crear destino</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Fecha creación</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {destinos.map((destino) => (
              <TableRow key={destino.id}>
                <TableCell className="font-medium">{destino.nombre}</TableCell>
                <TableCell>{new Date(destino.createdAt).toLocaleDateString("es-AR")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(destino.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {destinos.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No hay destinos cargados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}