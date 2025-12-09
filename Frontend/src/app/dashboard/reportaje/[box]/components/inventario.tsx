"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const inventario = [
  {
    item: "item A",
    cantidad: 0,
  },
];

export function TablaInventario({ idBox }: { idBox: string }) {
  const [tableData, setData] = useState<any[]>(inventario);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiFetch(`/api/reports/inventory?box=${idBox}`);
        const data: any = await res?.json();

        const parsed = Object.entries(data).map(([key, value]) => ({
          key,
          value,
        }));

        setData(parsed);
      } catch (error) {
        console.error("Error en la obtención de los datos:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Cantidad</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((inventario, i) => (
          <TableRow key={i}>
            <TableCell className="font-semibold">{inventario.key}</TableCell>
            <TableCell>{inventario.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

///////////////////////////////////////////////////

export function EditarInventario({
  idBox,
  onClose,
  onSaved,
}: {
  idBox: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const router = useRouter();
  const [items, setItems] = useState<{ key: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar inventario al abrir
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await apiFetch(`/api/reports/inventory?box=${idBox}`);
        const data: any = await res?.json();

        // si no viene objeto, usar vacío
        const safeData = typeof data === "object" && data !== null ? data : {};

        // convertir objeto -> array [{key, value}]
        const parsed = Object.entries(safeData).map(([key, value]) => ({
          key,
          value: Number(value) || 0,
        }));

        setItems(parsed);
      } catch (err) {
        console.error("Error cargando inventario:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [idBox]);

  // Editar campo
  const updateField = (index: number, field: "key" | "value", value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: field === "value" ? Number(value) : value,
      };
      return copy;
    });
  };

  // Agregar item
  const addItem = () => {
    setItems((prev) => [...prev, { key: "", value: 0 }]);
  };

  // Eliminar item
  const deleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Guardar
  const saveChanges = async () => {
    try {
      setSaving(true);

      // convertir array a objeto y sanitizar
      const body = items.reduce((acc, curr) => {
        const name = (curr.key ?? "").toString().trim();
        const val = Number(curr.value);
        const safeVal = Number.isFinite(val) && val >= 0 ? Math.floor(val) : 0;
        if (name !== "") {
          acc[name] = safeVal;
        }
        return acc;
      }, {} as Record<string, number>);

      // DELETE anterior
      const delRes = await apiFetch(
        `/api/reports/delete_inventory?box=${idBox}`,
        {
          method: "DELETE",
        }
      );

      if (delRes && "ok" in delRes && !delRes.ok) {
        // si tu apiFetch retorna Response, chequea res.ok; si retorna otra cosa, ajusta
        console.error("Error borrando inventario (delete):", delRes);
        // continuar igual o abortar según prefieras
      }

      // POST nuevo inventario (objeto)
      const postRes = await apiFetch(
        `/api/reports/post_inventory?box=${idBox}`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      // Manejo básico de errores
      if (postRes && "ok" in postRes && !postRes.ok) {
        console.error("Error posteando inventario:", postRes);
      }

      if (typeof window !== "undefined") {
        window.location.reload();
      }

      // Notificar y cerrar
      onSaved();
      onClose();
    } catch (err) {
      console.error("Error guardando inventario:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <div
        className="w-full"
        style={{ maxHeight: "360px", overflowY: "scroll" }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Item</TableHead>
              <TableHead className="w-1/4">Cantidad</TableHead>
              <TableHead className="w-1/4">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={row.key}
                    onChange={(e) => updateField(index, "key", e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    value={row.value}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateField(
                        index,
                        "value",
                        Number.isFinite(val) ? (val < 0 ? 0 : val) : 0
                      );
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => deleteItem(index)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="w-full" style = {{display:"flex", justifyContent:"space-between"}}>
        {/* Botón agregar */}
        <div className="flex justify-start">
          <Button onClick={addItem}>Agregar Item</Button>
        </div>

        {/* Botones inferiores */}
        <div className="flex justify-end">
          <Button className = "mx-2" variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={saveChanges} disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </>
  );
}
