import { ddb, commands } from "../_lib/dynamo.js";

export const main = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const { fecha1, fecha2 } = qs;
    if (!fecha1 || !fecha2) {
      return { statusCode: 400, body: JSON.stringify({ error: "fecha1 y fecha2 requeridos" }) };
    }

    const result = await ddb.send(new commands.ScanCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      FilterExpression: "#fecha BETWEEN :f1 AND :f2",
      ExpressionAttributeNames: { "#fecha": "fecha" },
      ExpressionAttributeValues: { ":f1": fecha1, ":f2": fecha2 }
    }));

    const listaAgendamientos = result.Items.map(item => ({
      idagendamiento: item.idagendamiento,
      idbox: item.idBox,
      idfuncionario: item.idFuncionario,
      idpaciente: item.idPaciente,
      fecha: item.fecha,
      horaentrada: item.horaEntrada,
      horasalida: item.horaSalida
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(listaAgendamientos),
    };

  } catch (err) {
    console.error("Error en getAgendamientoFecha:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
