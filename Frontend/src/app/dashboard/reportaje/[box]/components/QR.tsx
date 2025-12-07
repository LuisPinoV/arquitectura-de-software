import QRCode from "react-qr-code";

export function QRBox({
  idbox,
  userId,            // idFuncionario
  idPaciente,        // si ya lo tienes
}: {
  idbox: string;
  userId: string;
  idPaciente: string;
}) {
  const fecha = new Date();
  
  const fechaStr = fecha.toLocaleDateString("es-CL"); // 12-12-2025
  const horaStr = fecha.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }); // 15:30
  const horaStr2 = fecha.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }); // 15:30


  const query = new URLSearchParams({
    idConsulta: `03`,
    idPaciente: '01',//idPaciente,
    idFuncionario: '01',//userId,
    idBox: `${idbox}`,
    fecha: fechaStr,
    horaEntrada: horaStr,
    horaSalida: horaStr2
  });

  const url = `https://p547c5u13d.execute-api.us-east-1.amazonaws.com/agendamiento/?${query.toString()}`;

  return (
    <>
      {idbox && <QRCode value={url} size={256} />}
    </>
  );
}
