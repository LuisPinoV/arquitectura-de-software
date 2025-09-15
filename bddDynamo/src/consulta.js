const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const AGENDAMIENTOTABLE = process.env.TABLE || "Agendamiento";

module.exports.getConsultas = async (event) => {
  let statusCode = 200;
  let msg;
  
  try {
    const result = await dynamodb.scan({
      TableName: AGENDAMIENTOTABLE,
    }).promise();

    msg = result.Items;

  } catch (error) {
    console.error(error);
    statusCode = 500;
    msg = "Error al ejecutar consulta";
  }

  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: msg,
    }),
  };
};