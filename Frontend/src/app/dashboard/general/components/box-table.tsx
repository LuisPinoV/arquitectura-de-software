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
import { apiFetch } from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const boxes = [
  {
    numero: "MISSING-VALUES",
    enUso: "Ocupado",
    usoPromedio: "5.4%",
    usoHoy: "2.1%"
  },
]

export function BoxesTable() {
  const { t } = useLanguage();
  const [tableData, setData] = useState<any[]>(boxes);
  
    useEffect(() => {
      async function fetchData() {
        try {          
          const res = await apiFetch(
            `/api/general/table_box_data`
          );
          const data: any = await res?.json();
          setData(Array.isArray(data) ? data : []);
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
          <TableHead>{t("common.number")}</TableHead>
          <TableHead>{t("common.status")}</TableHead>
          <TableHead>{t("common.usageToday")}</TableHead>
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
