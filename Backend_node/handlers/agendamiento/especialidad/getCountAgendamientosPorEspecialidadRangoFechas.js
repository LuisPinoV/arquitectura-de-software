import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export const main = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const { fecha_inicio, fecha_final } = qs;
    if (!fecha_inicio || !fecha_final) {
      return { statusCode: 400, body: JSON.stringify({ error: "fecha_inicio y fecha_final requeridos" }) };
    }

    // Traer agendamientos en rango de fechas
    const agendamientosResult = await ddb.send(new ScanCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      FilterExpression: "#fecha BETWEEN :inicio AND :fin",
      ExpressionAttributeNames: { "#fecha": "fecha" },
      ExpressionAttributeValues: { ":inicio": fecha_inicio, ":fin": fecha_final },
      ProjectionExpression: "idbox"
    }));

    // Traer todos los boxes
    const boxesResult = await ddb.send(new ScanCommand({
      TableName: process.env.BOX_TABLE || "Box",
      ProjectionExpression: "idbox, idespecialidadbox"
    }));
    const boxMap = {};
    boxesResult.Items.forEach(b => { boxMap[b.idbox] = b.idespecialidadbox; });

    // Traer todas las especialidades
    const espResult = await ddb.send(new ScanCommand({
      TableName: process.env.ESPECIALIDADBOX_TABLE || "especialidadbox",
      ProjectionExpression: "idespecialidadbox, nombre"
    }));
    const espMap = {};
    espResult.Items.forEach(e => { espMap[e.idespecialidadbox] = e.nombre; });

    // Contar agendamientos por especialidad
    const contador = {};
    agendamientosResult.Items.forEach(a => {
      const idesp = boxMap[a.idbox];
      if (!idesp) return;
      const nombreEsp = espMap[idesp];
      if (!nombreEsp) return;
      contador[nombreEsp] = (contador[nombreEsp] || 0) + 1;
    });

    const listaAgendamientos = Object.keys(contador)
      .map(especialidad => ({ especialidad, count: contador[especialidad] }))
      .sort((a, b) => b.count - a.count);

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(listaAgendamientos),
    };

  } catch (err) {
    console.error("Error en getCountAgendamientosPorEspecialidadRangoFechas:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
