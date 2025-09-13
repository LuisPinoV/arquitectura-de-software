import { ddb, commands } from "../_lib/dynamo.js";

export const cantidadAgendamientosEntreFechas = async (fecha1: string, fecha2: string): Promise<number> => {
  const result = await ddb.send(new commands.ScanCommand({
    TableName: process.env.AGENDAMIENTOS_TABLE || "Agendamiento",
    FilterExpression: "#fecha BETWEEN :f1 AND :f2",
    ExpressionAttributeNames: { "#fecha": "fecha" },
    ExpressionAttributeValues: { ":f1": fecha1, ":f2": fecha2 }
  }));

  return result.Count || 0;
};
