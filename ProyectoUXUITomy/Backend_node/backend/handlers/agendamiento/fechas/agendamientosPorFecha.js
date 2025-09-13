import { ddb, commands } from "../_lib/dynamo.js";

export const main = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const { fecha } = qs;
    if (!fecha) {
      return { statusCode: 400, body: JSON.stringify({ error: "fecha requerida" }) };
    }

    // Buscar agendamientos por fecha
    const result = await ddb.send(new commands.ScanCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      FilterExpression: "#fecha = :fecha",
      ExpressionAttributeNames: { "#fecha": "fecha" },
      ExpressionAttributeValues: { ":fecha": fecha }
    }));

    // Convertir en objeto {idagendamiento: {...}}
    const jsonAgendamientos = {};
    result.Items.forEach(item => {
      jsonAgendamientos[item.idagendamiento] = {
        idbox: item.idBox,
        idfuncionario: item.idFuncionario,
        idpaciente: item.idPaciente,
        horaentrada: item.horaEntrada,
        horasalida: item.horaSalida
      };
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(jsonAgendamientos),
    };

  } catch (err) {
    console.error("Error en agendamientosPorFecha:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
