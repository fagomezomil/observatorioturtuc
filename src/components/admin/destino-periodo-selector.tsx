"use client";

import { useEffect, useRef, useState } from "react";

interface Destino { id: string; nombre: string }
interface Periodo { id: string; nombre: string }

export function DestinoPeriodoSelector({
  onSelected,
}: {
  onSelected: (destinoId: string, periodoId: string) => void;
}) {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [destinoId, setDestinoId] = useState("");
  const [periodoId, setPeriodoId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/destinos").then((r) => r.json()),
      fetch("/api/periodos").then((r) => r.json()),
    ]).then(([d, p]) => {
      setDestinos(d);
      setPeriodos(p);
      setLoading(false);
    });
  }, []);

  const onSelectedRef = useRef(onSelected);
  onSelectedRef.current = onSelected;

  useEffect(() => {
    if (destinoId && periodoId) {
      onSelectedRef.current(destinoId, periodoId);
    }
  }, [destinoId, periodoId]);

  if (loading) return <p className="text-muted-foreground">Cargando...</p>;

  return (
    <div className="flex gap-4">
      <select
        className="rounded-md border px-3 py-2 text-sm"
        value={destinoId}
        onChange={(e) => setDestinoId(e.target.value)}
      >
        <option value="">Seleccionar destino</option>
        {destinos.map((d) => (
          <option key={d.id} value={d.id}>{d.nombre}</option>
        ))}
      </select>
      <select
        className="rounded-md border px-3 py-2 text-sm"
        value={periodoId}
        onChange={(e) => setPeriodoId(e.target.value)}
      >
        <option value="">Seleccionar periodo</option>
        {periodos.map((p) => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>
    </div>
  );
}