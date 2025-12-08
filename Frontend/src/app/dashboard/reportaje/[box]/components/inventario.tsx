
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { apiFetch } from "@/lib/apiClient";
import { useEffect, useState } from "react"

const inventario = [
    {
        item: "item A",
        cantidad: 0
    }
]

export function TablaInventario({idBox}:{idBox:string}) {
    const [tableData, setData] = useState<any[]>(inventario);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await apiFetch(
                    `/api/reports/inventory?box=${idBox}`
                );
                const data: any = await res?.json();

                setData(Array.isArray(data) ? data : []);
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
                    <TableHead>
                        Item
                    </TableHead>
                    <TableHead>
                        Cantidad
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableData.map((inventario) => (
                    <TableRow key={inventario.item}>
                        <TableCell className="font-semibold">
                            {inventario.item}
                        </TableCell>
                        <TableCell>
                            {inventario.cantidad}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}