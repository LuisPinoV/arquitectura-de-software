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
    const { id } = qs;
    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: "id requerido" }) };
    }

    // Eliminar agendamiento principal
    try {
      await ddb.send(new DeleteCommand({
        TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
        Key: { idagendamiento: id }
      }));
    } catch (err) {
      console.error("Error eliminando agendamiento:", err);
      return { statusCode: 500, body: JSON.stringify({ error: "Error eliminando agendamiento" }) };
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true }),
    };

  } catch (err) {
    console.error("Error en eliminarAgendamiento:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
