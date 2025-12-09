"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/apiClient";
import { useUserProfile } from '@/hooks/use-user';
import { useRouter } from "next/navigation";
import {v4 as uuidv4} from 'uuid';

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

export default function AutoFillPopupPage() {
  const router = useRouter();
  const profile = useUserProfile() as any;

  const [authChecked, setAuthChecked] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [idUsuario, setIdUsuario] = useState("");
  const [idFuncionario, setIdFuncionario] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [idBox, setIdBox] = useState<string | null>(null);
  const [listaUsuarios, setListaUsuarios] = useState<Paciente[]>([]);
  const [listaFuncionarios, setListaFuncionarios] = useState<Funcionario[]>([]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    if (!token) {
      router.replace(`/agendamiento_instantaneo/login`);
    }else {
      setAuthChecked(true)
    }
  }, [router]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsuarios = await apiFetch("/api/agendamiento_instantaneo/get_pacientes");
        const dataUsuarios = await resUsuarios?.json();
        setListaUsuarios(Array.isArray(dataUsuarios) ? dataUsuarios : []);
      } catch (err) {
        console.error("Error cargando a los usuarios", err);
        setListaUsuarios([]);
      }

      try {
        const resFuncionarios = await apiFetch("/api/agendamiento_instantaneo/get_funcionarios");
        const dataFuncionarios = await resFuncionarios?.json();
        setListaFuncionarios(Array.isArray(dataFuncionarios) ? dataFuncionarios : []);
      } catch (error) {
        console.error("Error cargando a los funcionarios", error);
        setListaFuncionarios([]);
      }
    };

    fetchData();
  }, []);

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
      idConsulta: uuidv4(),
      idPaciente:idUsuario,
      idFuncionario,
      fecha,
      horaEntrada: hora,
      horaSalida,
      idBox,
    };

    // api para postear agendamiento
    try {
      await apiFetch("/api/agendamiento_instantaneo/post_agendamiento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log('Posteado el agendamiento')
    } catch (error) {
      console.error("Error en la creación del agendamiento", error);
    }
    setShowPopup(false);
  };
  
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
                    {Array.isArray(listaUsuarios) && listaUsuarios.map((u) => (
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
                    {Array.isArray(listaFuncionarios) && listaFuncionarios.map((f) => (
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
