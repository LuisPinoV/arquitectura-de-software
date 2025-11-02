import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient();
const dynamo = DynamoDBDocumentClient.from(client);

export class BoxRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamo = dynamo;
  }

  async createBox({ idBox, especialidad, pasillo, capacidad, disponible = true }) {
    const now = new Date().toISOString();

    const item = {
      PK: `BOX#${idBox}`,
      SK: "METADATA",
      tipo: "Box",
      idBox,
      especialidad,
      pasillo,
      capacidad,
      disponible,
      createdAt: now,
      updatedAt: now,
    };

    await this.dynamo.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );

    return item;
  }

  
  async getBox(idBox) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: `BOX#${idBox}`,
        SK: "METADATA",
      },
    });

    const result = await this.dynamo.send(command);
    return result.Item || null;
  }

  
  async getAllBoxes() {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "#tipo = :t",
      ExpressionAttributeNames: { "#tipo": "tipo" },
      ExpressionAttributeValues: { ":t": "Box" },
    });

    const result = await this.dynamo.send(command);
    return result.Items || [];
  }


  async updateBox(idBox, updates) {
    const now = new Date().toISOString();

    const updateExpr = [];
    const exprAttrValues = { ":u": now };
    const exprAttrNames = {};

    for (const [key, value] of Object.entries(updates)) {
      updateExpr.push(`#${key} = :${key}`);
      exprAttrValues[`:${key}`] = value;
      exprAttrNames[`#${key}`] = key;
    }

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        PK: `BOX#${idBox}`,
        SK: "METADATA",
      },
      UpdateExpression: `SET ${updateExpr.join(", ")}, updatedAt = :u`,
      ExpressionAttributeNames: exprAttrNames,
      ExpressionAttributeValues: exprAttrValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await this.dynamo.send(command);
    return result.Attributes;
  }


  async deleteBox(idBox) {
    const get = new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: `BOX#${idBox}`,
        SK: "METADATA",
      },
    });

    const found = await this.dynamo.send(get);
    console.log("Box encontrado antes de borrar:", found.Item);

    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        PK: `BOX#${idBox}`,
        SK: "METADATA",
      },
      ReturnValues: "ALL_OLD",
    });

    const result = await this.dynamo.send(command);
    return { idBox, deletedItem: result.Attributes || null };
  }

 
  async getAgendamientosByBox(idBox) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "AgendamientosPorBox",
      KeyConditionExpression: "BoxId = :bid",
      ExpressionAttributeValues: {
        ":bid": `BOX#${idBox}`,
      },
    });

    const result = await this.dynamo.send(command);
    return result.Items || [];
  }
}

export const boxRepository = new BoxRepository("Agendamiento");
