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
    // Obtener todos los funcionarios
    const funcionariosResult = await ddb.send(new ScanCommand({
      TableName: process.env.FUNCIONARIO_TABLE || "Funcionario",
      ProjectionExpression: "id, nombre, idtipofuncionario"
    }));
    const funcionarios = funcionariosResult.Items || [];

    // Obtener todos los tipos de funcionario
    const tiposResult = await ddb.send(new ScanCommand({
      TableName: process.env.TIPO_FUNCIONARIO_TABLE || "tipofuncionario",
      ProjectionExpression: "id, nombre"
    }));
    const tipos = tiposResult.Items || [];

    // Unir en memoria (equivalente a INNER JOIN)
    const funcionariosFull = funcionarios.map(f => {
      const tipo = tipos.find(t => t.id === f.idtipofuncionario) || {};
      return { ...f, tipoFuncionario: tipo.nombre || null };
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(funcionariosFull),
    };

  } catch (err) {
    console.error("Error en funcionariosFull:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Error interno" }) };
  }
};
