import QRCode from "react-qr-code";
import { forwardRef } from "react";

export const QRBox = forwardRef(function QRBox({
  idbox,
  userId,            // idFuncionario
  idPaciente,        // si ya lo tienes
}: {
  idbox: string;
  userId: string;
  idPaciente: string;
}, ref: any) {

  const date = new Date();
  
  const dateStr = date.toISOString().split("T")[0]; // 2025-12-12
  const timeStr = date.toISOString().split("T")[1].split(".")[0]; // 15:30

  
  date.setMinutes(date.getMinutes() + 30);

  const horaStr2 = date.toISOString().split("T")[1].split(".")[0]; // 16:00


  const query = new URLSearchParams({
    idConsulta: `03`,
    idPaciente: '01',//idPaciente,
    idFuncionario: '01',//userId,
    idBox: `${idbox}`,
    fecha: dateStr,
    horaEntrada: timeStr,
    horaSalida: horaStr2
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://192.168.8.128:3000/"; 
  const url = `${baseUrl}/agendamiento_instantaneo?${query.toString()}`;

  return (
    <div ref={ref}>
      {idbox && <QRCode value={url} size={256} />}
    </div>
  );
});
