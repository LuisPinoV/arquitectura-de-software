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
    numero: "MISSING-VALUES",
    enUso: "Ocupado",
    usoPromedio: "5.4%",
    usoHoy: "2.1%"
  },
]

export function BoxesTable() {
  const [tableData, setData] = useState<any[]>(boxes);
  
    useEffect(() => {
      async function fetchData() {
        try {
          const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
          
          const res = await fetch(
            `/api/general/table_box_data`, 
            {
              method:"GET",
              headers,
            }
          );
          const data: any = await res.json();
          setData(data ?? []);
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
