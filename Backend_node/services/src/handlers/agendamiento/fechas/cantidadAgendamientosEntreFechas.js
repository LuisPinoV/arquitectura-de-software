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

export const cantidadAgendamientosEntreFechas = async (fecha1, fecha2) => {
  const result = await ddb.send(new ScanCommand({
    TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
    FilterExpression: "#fecha BETWEEN :f1 AND :f2",
    ExpressionAttributeNames: { "#fecha": "fecha" },
    ExpressionAttributeValues: { ":f1": fecha1, ":f2": fecha2 }
  }));

  return result.Count || 0;
};
