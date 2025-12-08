import {
  DynamoDBClient
} from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient();
const dynamo = DynamoDBDocumentClient.from(client);

export class FuncionarioRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamo = dynamo;
  }

  async createFuncionario({ idFuncionario, nombre, rut, tipoFuncionario, organizacionId }) {
    const now = new Date().toISOString();

    const item = {
      PK: `FUNCIONARIO#${idFuncionario}`,
      SK: "PROFILE",
      tipo: "Funcionario",
      idFuncionario,
      nombre,
      rut,
      tipoFuncionario,
      organizacionId,
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

  async getFuncionario(idFuncionario, organizacionId) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: `FUNCIONARIO#${idFuncionario}`,
        SK: "PROFILE",
      },
    });

    const result = await this.dynamo.send(command);
    const item = result.Item;

    // Validar permisos de organización
    if (item && item.organizacionId !== organizacionId) {
      throw new Error("No tienes permiso para acceder a este recurso");
    }

    return item || null;
  }

  async updateFuncionario(idFuncionario, updates, organizacionId) {
    // Primero validar que el funcionario pertenece a la organización
    const funcionarioActual = await this.getFuncionario(idFuncionario, organizacionId);
    if (!funcionarioActual) {
      throw new Error(`Funcionario ${idFuncionario} no encontrado`);
    }

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
        PK: `FUNCIONARIO#${idFuncionario}`,
        SK: "PROFILE",
      },
      UpdateExpression: `SET ${updateExpr.join(", ")}, updatedAt = :u`,
      ExpressionAttributeNames: exprAttrNames,
      ExpressionAttributeValues: exprAttrValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await this.dynamo.send(command);
    return result.Attributes;
  }

  async deleteFuncionario(idFuncionario, organizacionId) {
    console.log("deleteFuncionario -> idFuncionario:", idFuncionario);

    const get = new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: `FUNCIONARIO#${idFuncionario}`,
        SK: "PROFILE",
      },
    });

    const found = await this.dynamo.send(get);
    console.log("Funcionario encontrado antes de borrar:", found.Item);

    // Validar permisos de organización
    if (found.Item && found.Item.organizacionId !== organizacionId) {
      throw new Error("No tienes permiso para eliminar este recurso");
    }

    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        PK: `FUNCIONARIO#${idFuncionario}`,
        SK: "PROFILE",
      },
      ReturnValues: "ALL_OLD",
    });

    const result = await this.dynamo.send(command);
    console.log("deleteFuncionario result:", result);

    return { idFuncionario, deletedItem: result.Attributes || null };
  }

  async getAgendamientosByFuncionario(idFuncionario) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "AgendamientosPorFuncionario",
      KeyConditionExpression: "FuncionarioId = :fid",
      ExpressionAttributeValues: {
        ":fid": `FUNCIONARIO#${idFuncionario}`,
      },
    });

    const result = await this.dynamo.send(command);
    return result.Items || [];
  }

  // funcionario.repository.js
  async getAllFuncionarios(organizacionId) {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "begins_with(PK, :pkPrefix) AND SK = :sk AND organizacionId = :orgId",
      ExpressionAttributeValues: {
        ":pkPrefix": "FUNCIONARIO#",
        ":sk": "PROFILE",
        ":orgId": organizacionId,
      },
    });

    const result = await this.dynamo.send(command);
    return result.Items || [];
  }
}

export const funcionarioRepository = new FuncionarioRepository("Agendamiento");
