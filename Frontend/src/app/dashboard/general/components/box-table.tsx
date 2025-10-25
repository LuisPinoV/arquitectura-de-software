"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";

const boxes = [
  {
    numero: "BOX-1",
    enUso: "Ocupado",
    usoPromedio: "5.4%",
    usoHoy: "2.1%"
  },
  {
    numero: "BOX-2",
    enUso: "Ocupado",
    usoPromedio: "3.2%",
    usoHoy: "5.1%"
  },
  {
    numero: "BOX-3",
    enUso: "Libre",
    usoPromedio: "10.7%",
    usoHoy: "9.1%"
  },
  {
    numero: "BOX-4",
    enUso: "Libre",
    usoPromedio: "1.3%",
    usoHoy: "12.1%"
  },
  {
    numero: "BOX-5",
    enUso: "Ocupado",
    usoPromedio: "6.0%",
    usoHoy: "3.0%"
  },
  {
    numero: "BOX-6",
    enUso: "Libre",
    usoPromedio: "8.9%",
    usoHoy: "6.2%"
  },
  {
    numero: "BOX-7",
    enUso: "Libre",
    usoPromedio: "11.2%",
    usoHoy: "8.2%"
  },
]

export function BoxesTable() {
  const [tableData, setData] = useState<any[]>(boxes);
  
    useEffect(() => {
      async function fetchData() {
        try {
  
          const res = await fetch(
            `/dashboard/general/api/table_box_data`
          );
          const data: any = await res.json();
          setData(data["final_data"]);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
  
      fetchData();
    }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Uso Hoy</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((box) => (
          <TableRow key={box.numero}>
            <TableCell className="font-semibold">{box.numero}</TableCell>
            <TableCell>{box.enUso}</TableCell>
            <TableCell>{box.usoHoy}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
