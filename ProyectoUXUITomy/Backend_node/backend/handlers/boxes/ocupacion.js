import { ddb, commands } from "../_lib/dynamo.js";

const HORAS = [
  '08:00','08:30','09:00','09:30',
  '10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30',
  '14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30',
  '18:00','18:30','19:00','19:30',
  '20:00','20:30','21:00','21:30',
  '22:00','22:30','23:00','23:30'
];

export const main = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const box = qs.box;
    const fecha = qs.fecha;
    if (!box || !fecha) {
      return { statusCode: 400, body: JSON.stringify({ error: "box y fecha requeridos" }) };
    }

    // Obtener agendamientos para el box y fecha
    const params = {
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      FilterExpression: "#idbox = :box AND #fecha = :fecha",
      ExpressionAttributeNames: { "#idbox": "idbox", "#fecha": "fecha" },
      ExpressionAttributeValues: { ":box": box, ":fecha": fecha },
      ProjectionExpression: "horaentrada",
    };

    const result = await ddb.send(new commands.ScanCommand(params));

    // Quitar horas ocupadas
    const ocupadas = result.Items.map(i => i.horaentrada);
    const disponibles = HORAS.filter(h => !ocupadas.includes(h));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(disponibles),
    };

  } catch (err) {
    console.error("Error en disponibilidad:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
