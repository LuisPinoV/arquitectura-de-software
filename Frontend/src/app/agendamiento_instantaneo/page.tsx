"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/apiClient";
import { useUserProfile } from '@/hooks/use-user';

export default function AutoFillPopupPage() {
  const [showPopup, setShowPopup] = useState(true);

  const [idUsuario, setIdUsuario] = useState("");
  const [idFuncionario, setIdFuncionario] = useState("");

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [idBox, setIdBox] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsuarios = await apiFetch("/api/agendamiento_instantaneo/get_paciente");
        const dataUsuarios = await resUsuarios?.json();
        setListaUsuarios(dataUsuarios as Paciente[]);
      } catch (err) {
        console.error("Error cargando a los usuarios", err);
      }

      try {
        const resFuncionarios = await apiFetch("/api/agendamiento_instantaneo/get_funcionarios");
        const dataFuncionarios = await resFuncionarios?.json();
        console.log("Funcionarios:", dataFuncionarios)
        setListaFuncionarios(dataFuncionarios as Funcionario[])
      } catch (error) {
        console.error("Error cargando a los funcionarios", error)
      }
    };

    fetchData();
  }, []);

  interface Funcionario {
    idFuncionario: string;
    nombre: string;
    rut: string;
  }

  interface Paciente {
    idPaciente: string;
    nombre: string;
    apellido: string;
    rut: string;
  }

  const [listaUsuarios, setListaUsuarios] = useState<Paciente[]>([]);
  const [listaFuncionarios, setListaFuncionarios] = useState<Funcionario[]>([]);

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

    // api para postear agendamiento
    await apiFetch("/api/agendamiento_instantaneo/post_agendamiento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setShowPopup(false);
  };
  const profile = useUserProfile ? useUserProfile() as any : null;
  const space = profile?.spaceName ?? 'Boxes';

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
                  <strong>Seleccione su usuario</strong>
                  <select
                    className="w-full border rounded p-1 mt-1"
                    value={idUsuario}
                    onChange={(e) => setIdUsuario(e.target.value)}
                  >
                    <option value="">Seleccione...</option>
                    {listaUsuarios.map((u) => (
                      <option key={u.idPaciente} value={u.idPaciente}>{u.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <strong>Seleccione un funcionario</strong>
                  <select
                    className="w-full border rounded p-1 mt-1"
                    value={idFuncionario}
                    onChange={(e) => setIdFuncionario(e.target.value)}
                  >
                    <option value="">Seleccione...</option>
                    {listaFuncionarios.map((f) => (
                      <option key={f.idFuncionario} value={f.idFuncionario}>{f.nombre}</option>
                    ))}
                  </select>
                </div>

                <p><strong>Fecha:</strong> {fecha}</p>
                <p><strong>Hora entrada:</strong> {hora}</p>
                <p><strong>Hora salida:</strong> {horaSalida}</p>
                <p><strong>{space}:</strong> {idBox}</p>
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
