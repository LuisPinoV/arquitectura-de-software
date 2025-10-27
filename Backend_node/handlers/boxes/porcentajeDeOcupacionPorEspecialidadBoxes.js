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
    const { fecha, hora } = qs;
    if (!fecha || !hora) {
      return { statusCode: 400, body: JSON.stringify({ error: "fecha y hora requeridos" }) };
    }

    const horaObjetivo = hora.split(":").map(Number);
    const boxesJson = {};

    // }Obtener todos los boxes
    const boxesResult = await ddb.send(new ScanCommand({
      TableName: process.env.BOX_TABLE || "Box",
      ProjectionExpression: "idbox, idespecialidadbox"
    }));

    // Obtener todas las especialidades
    const espResult = await ddb.send(new ScanCommand({
      TableName: process.env.ESPECIALIDADBOX_TABLE || "especialidadbox",
      ProjectionExpression: "idespecialidadbox, nombre"
    }));
    const espMap = {};
    espResult.Items.forEach(e => {
      espMap[e.idespecialidadbox] = e.nombre;
    });

    // Inicializar boxes con especialidad
    boxesResult.Items.forEach(b => {
      boxesJson[b.idbox] = {
        especialidad: espMap[b.idespecialidadbox] || "",
        libre: true,
        ocupancia: 0
      };
    });

    // Obtener agendamientos de la fecha
    const agendamientosResult = await ddb.send(new ScanCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      FilterExpression: "#fecha = :fecha",
      ExpressionAttributeNames: { "#fecha": "fecha" },
      ExpressionAttributeValues: { ":fecha": fecha },
      ProjectionExpression: "idbox, horaentrada, horasalida"
    }));

    // Calcular ocupancia y disponibilidad
    agendamientosResult.Items
      .sort((a, b) => a.horaentrada.localeCompare(b.horaentrada))
      .forEach(a => {
        const entrada = a.horaentrada.split(":").map(Number);
        const salida = a.horasalida.split(":").map(Number);

        const minutos = (salida[0] - entrada[0]) * 60 + (salida[1] - entrada[1]);
        boxesJson[a.idbox].ocupancia += minutos;

        if (
          (horaObjetivo[0] > entrada[0] && horaObjetivo[0] < salida[0]) ||
          (horaObjetivo[0] === entrada[0] && horaObjetivo[1] >= entrada[1]) ||
          (horaObjetivo[0] === salida[0] && horaObjetivo[1] <= salida[1])
        ) {
          boxesJson[a.idbox].libre = false;
        }
      });

    Object.keys(boxesJson).forEach(k => {
      boxesJson[k].ocupancia /= 930;
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(boxesJson),
    };

  } catch (err) {
    console.error("Error en PorcentajeDeOcupacionPorEspecialidadBoxes:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
