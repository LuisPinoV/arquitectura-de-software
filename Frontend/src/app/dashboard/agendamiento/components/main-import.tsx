"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ScheduleRow = {
  date: string;
  time: string;
  hour: number;
  box: number;
  funcionario: number;
};

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";

export default function ScheduleUploader() {
  const [data, setData] = useState<ScheduleRow[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];

    Papa.parse<ScheduleRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const parsedData = results.data.map((row: any) => ({
          ...row,
          box: parseInt(row.box as unknown as string),
          funcionario: parseInt(row.funcionario as unknown as string),
        }));
        setData(parsedData);
      },
    });
  };

  const handlePushToBackend = async () => {
    for (let i = 0; i < data.length; i++) {
      const curData = data[i];
      try {
        const res = await fetch(
          `/dashboard/agendamiento/api/schedule?date=${curData.date}&time=${curData.time}&box=${curData.box}&funcionario=${curData.funcionario}`
        );
        if (res.ok) {
          toast("Horario creado", {
            description: new Date().toLocaleString(),
            action: {
              label: "Descartar",
              onClick: () => console.log("Descartar"),
            },
          });
        } else {
          toast("Error instalando horario", {
            description: new Date().toLocaleString(),
            action: {
              label: "Descartar",
              onClick: () => console.log("Descartar"),
            },
          });
        }
      } catch (err) {
        console.error(err);
        toast("Error de internet", {
          description: new Date().toLocaleString(),
          action: {
            label: "Descartar",
            onClick: () => console.log("Descartar"),
          },
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir CSV con calendario</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Input
            id="CSV"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="mb-4"
            lang="es"
          />
        </div>
        {data.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Box</TableHead>
                  <TableHead>Funcionario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.box}</TableCell>
                    <TableCell>{row.funcionario}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Button className="mt-4" onClick={handlePushToBackend}>
              Confirmar
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
