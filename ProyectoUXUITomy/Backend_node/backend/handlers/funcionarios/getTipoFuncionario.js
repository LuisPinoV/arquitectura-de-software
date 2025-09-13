import { ddb, commands } from "../_lib/dynamo.js";

export const main = async (event) => {
  try {
    const params = {
      TableName: process.env.TIPO_FUNCIONARIO_TABLE || "tipofuncionario",
    };

    const result = await ddb.send(new commands.ScanCommand(params));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(result.Items || []),
    };
  } catch (err) {
    console.error("Error en getTipoFuncionario:", err);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
};
