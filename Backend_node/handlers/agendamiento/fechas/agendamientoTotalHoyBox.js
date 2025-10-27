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
    const { idbox, fecha } = qs;

    if (!idbox || !fecha) {
      return { statusCode: 400, body: JSON.stringify({ error: "idbox y fecha requeridos" }) };
    }

    const result = await ddb.send(new ScanCommand({
      TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
      FilterExpression: "#idbox = :idbox AND #fecha = :fecha",
      ExpressionAttributeNames: { 
        "#idbox": "idBox",
        "#fecha": "fecha"
      },
      ExpressionAttributeValues: { 
        ":idbox": Number(idbox), 
        ":fecha": fecha 
      }
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(result.Items || []),
    };

  } catch (err) {
    console.error("Error en agendamientoTotalHoyBox:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
