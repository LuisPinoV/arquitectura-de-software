"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AutoFillPopupPage() {
  const [showPopup, setShowPopup] = useState(true);

  const [idUsuario, setIdUsuario] = useState("");
  const [idFuncionario, setIdFuncionario] = useState("");

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
const [idBox, setIdBox] = useState<string | null>(null);


  const listaUsuarios = [
    { id: "u1", nombre: "Usuario 1" },
    { id: "u2", nombre: "Usuario 2" },
    { id: "u3", nombre: "Usuario 3" },
  ];

  const listaFuncionarios = [
    { id: "f1", nombre: "Funcionario 1" },
    { id: "f2", nombre: "Funcionario 2" },
    { id: "f3", nombre: "Funcionario 3" },
  ];

  useEffect(() => {
    const now = new Date();
    const fechaActual = now.toISOString().split("T")[0];
    const horaActual = now.toTimeString().slice(0, 5);

    const salida = new Date(now.getTime() + 30 * 60000);
    const horaSalidaCalc = salida.toTimeString().slice(0, 5);

    setFecha(fechaActual);
    setHora(horaActual);
    setHoraSalida(horaSalidaCalc);

    const params = new URLSearchParams(window.location.search);
    setIdBox(params.get("idbox"));
  }, []);

  const confirmar = async () => {
    const payload = {
      idUsuario,
      idFuncionario,
      fecha,
      horaEntrada: hora,
      horaSalida,
      idBox,
    };

    await fetch("https://tuapi.com/agendamiento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setShowPopup(false);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6">
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-[380px] p-2 shadow-2xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-center text-xl">Confirmar datos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-base">
                <div>
                  <strong>ID Usuario:</strong>
                  <select
                    className="w-full border rounded p-1 mt-1"
                    value={idUsuario}
                    onChange={(e) => setIdUsuario(e.target.value)}
                  >
                    <option value="">Seleccione...</option>
                    {listaUsuarios.map((u) => (
                      <option key={u.id} value={u.id}>{u.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <strong>ID Funcionario:</strong>
                  <select
                    className="w-full border rounded p-1 mt-1"
                    value={idFuncionario}
                    onChange={(e) => setIdFuncionario(e.target.value)}
                  >
                    <option value="">Seleccione...</option>
                    {listaFuncionarios.map((f) => (
                      <option key={f.id} value={f.id}>{f.nombre}</option>
                    ))}
                  </select>
                </div>

                <p><strong>Fecha:</strong> {fecha}</p>
                <p><strong>Hora entrada:</strong> {hora}</p>
                <p><strong>Hora salida:</strong> {horaSalida}</p>
                <p><strong>ID Box:</strong> {idBox}</p>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" onClick={() => setShowPopup(false)}>Cancelar</Button>
                <Button onClick={confirmar}>Confirmar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <h1 className="text-2xl">Página de agendamiento</h1>
    </div>
  );
}
