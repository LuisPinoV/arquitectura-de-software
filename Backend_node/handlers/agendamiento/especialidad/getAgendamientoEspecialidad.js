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
    const { especialidad } = qs;
    if (!especialidad) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "especialidad requerida" }),
      };
    }

    // Obtener idespecialidadbox
    const espResult = await ddb.send(
      new ScanCommand({
        TableName: process.env.ESPECIALIDADBOX_TABLE || "especialidadbox",
        FilterExpression: "#nombre = :nombre",
        ExpressionAttributeNames: { "#nombre": "nombre" },
        ExpressionAttributeValues: { ":nombre": especialidad },
        ProjectionExpression: "idespecialidadbox",
      })
    );

    if (!espResult.Items[0]) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Especialidad no encontrada" }),
      };
    }

    const idespecialidadbox = espResult.Items[0].idespecialidadbox;

    // Obtener todos los boxes de esa especialidad
    const boxesResult = await ddb.send(
      new ScanCommand({
        TableName: process.env.BOX_TABLE || "Box",
        FilterExpression: "#idesp = :idesp",
        ExpressionAttributeNames: { "#idesp": "idespecialidadbox" },
        ExpressionAttributeValues: { ":idesp": idespecialidadbox },
        ProjectionExpression: "idbox",
      })
    );
    const boxIds = boxesResult.Items.map((b) => b.idbox);

    // Obtener agendamientos de esos boxes
    const agendamientosResult = await ddb.send(
      new ScanCommand({
        TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
        FilterExpression: boxIds.map((_, i) => `idbox = :id${i}`).join(" OR "),
        ExpressionAttributeValues: Object.fromEntries(
          boxIds.map((id, i) => [`:id${i}`, id])
        ),
      })
    );

    const jsonAgendamientos = {};
    agendamientosResult.Items.forEach((a) => {
      jsonAgendamientos[a.idagendamiento] = a;
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(jsonAgendamientos),
    };
  } catch (err) {
    console.error("Error en getAgendamientoEspecialidad:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
};
