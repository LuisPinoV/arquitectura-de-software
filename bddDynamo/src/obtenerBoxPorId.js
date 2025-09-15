const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient();
const dynamodb = DynamoDBDocumentClient.from(client);

module.exports.obtenerBoxPorId = async (event) => {
  try {
    const boxId = event.pathParameters?.boxId || event.queryStringParameters?.boxId;

    if (!boxId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Debes enviar un boxId" }),
      };
    }

    const params = {
      TableName: "Agendamiento",
      KeyConditionExpression: "PK = :pk AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": `BOX#${boxId}`,
        ":sk": "METADATA"
      }
    };

    const result = await dynamodb.send(new QueryCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items || []),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al consultar características del box" }),
    };
  }
};
