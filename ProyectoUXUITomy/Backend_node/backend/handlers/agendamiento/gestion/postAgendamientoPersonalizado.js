import { ddb, commands } from "../_lib/dynamo.js";
import { v4 as uuidv4 } from "uuid";

export const main = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { idBox, idFuncionario, idPaciente, fecha, horaEntrada, horaSalida } = body;
    if (!idBox || !idFuncionario || !idPaciente || !fecha || !horaEntrada || !horaSalida) {
      return { statusCode: 400, body: JSON.stringify({ error: "Todos los campos son requeridos" }) };
    }

    // Crear agendamiento
    const idagendamiento = uuidv4();
    const agendamiento = {
      idagendamiento,
      idBox,
      idFuncionario,
      idPaciente,
      fecha,
      horaEntrada,
      horaSalida
    };

    await ddb.send(new commands.PutCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      Item: agendamiento
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ agendamiento, estadoAgendamiento }),
    };

  } catch (err) {
    console.error("Error en postAgendamientoPersonalizado:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
