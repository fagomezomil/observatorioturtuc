"use client";

import { useState } from "react";
import { createPeriodo, deletePeriodo } from "@/lib/actions/periodos";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";

interface Periodo {
  id: string;
  temporada: string;
  mes: string | null;
  anio: number;
  nombre: string;
  createdAt: Date;
}

export function PeriodosTable({ periodos }: { periodos: Periodo[] }) {
  const [temporada, setTemporada] = useState("Verano");
  const [anio, setAnio] = useState(new Date().getFullYear().toString());
  const [nombre, setNombre] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreate = async () => {
    if (!nombre.trim()) return;
    await createPeriodo({
      temporada,
      anio: parseInt(anio),
      nombre: nombre.trim(),
    });
    setNombre("");
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Está seguro de eliminar este periodo? Se eliminarán todos los datos asociados.")) {
      await deletePeriodo(id);
    }
  };

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button />}>
          <Plus className="mr-2 h-4 w-4" />Nuevo periodo
        </DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Nuevo periodo</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Select value={temporada} onValueChange={(val) => setTemporada(val ?? "Verano")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Verano">Verano</SelectItem>
                <SelectItem value="Invierno">Invierno</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Año" value={anio} onChange={(e) => setAnio(e.target.value)} />
            <Input placeholder="Nombre (ej: Verano 2022)" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <Button onClick={handleCreate} className="w-full">Crear periodo</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Temporada</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Fecha creación</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periodos.map((periodo) => (
              <TableRow key={periodo.id}>
                <TableCell className="font-medium">{periodo.nombre}</TableCell>
                <TableCell><Badge variant={periodo.temporada === "Verano" ? "default" : "secondary"}>{periodo.temporada}</Badge></TableCell>
                <TableCell>{periodo.anio}</TableCell>
                <TableCell>{new Date(periodo.createdAt).toLocaleDateString("es-AR")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(periodo.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {periodos.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No hay periodos cargados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}