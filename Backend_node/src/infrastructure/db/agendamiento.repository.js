import { IAgendamientoRespository } from "../../domain/agendamiento/repositories/IAgendamientoEspacioRepository";
import { Agendamiento } from "../../domain/agendamiento/entities/agendamiento";
import { SpaceUtil } from "../../domain/agendamiento/entities/spaceUtils";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

class DynamoAgendamientoRepository extends IAgendamientoRespository {
  constructor() {
    super();
    const client = new DynamoDBClient({});
    this.docClient = DynamoDBDocumentClient.from(client);
    this.agendamientoTableName = process.env.AGENDAMIENTO_TABLE;
  }

  async findById(id) {
    const params = {
      TableName: this.agendamientoTableName,
      KeyConditionExpression: "idAgendamiento = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    };

    const result = await this.docClient.send(new ScanCommand(params));

    if (!result.Item) return undefined;

    const data = JSON.parse(result.Item.data);

    const utils = data.spaceUtils.map(
      (item) => new SpaceUtil(item.name, item.quantity)
    );

    return new Agendamiento(
      id,
      data.dateStart,
      data.dateEnd,
      data.statePetition,
      data.personal,
      utils,
      data.specialty
    );
  }

  async create(agendamiento) {
    const data = JSON.stringify(agendamiento);
    const id = agendamiento.getId();

    try {
      await this.docClient.send(
        new PutCommand({
          TableName: this.agendamientoTableName,
          Item: {
            idAgendamiento: id,
            data: data,
          },
        })
      );

      return { ok: true, agendamiento };
    } catch (err) {
      console.error("Failed to insert agendamiento:", err);
      return { ok: false, error: err };
    }
  }

  async delete(id) {
    try {
      await this.docClient.send(
        new DeleteCommand({
          TableName: this.agendamientoTableName,
          Key: { idAgendamiento: id },
          ConditionExpression: "attribute_exists(id)",
        })
      );
      return { ok: true };
    } catch (err) {
      console.error("Delete failed:", err);
      return { ok: false, error: err };
    }
  }

  async update(agendamiento) {
    const updateExpression = [];
    const expressionAttributeValues = {};

    const dataJsonString = JSON.stringify(agendamiento);
    const dataJson = JSON.parse(dataJsonString);

    for (const key in dataJson) {
      updateExpression.push(`${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = dataJson[key];
    }

    await docClient.send(
      new UpdateCommand({
        TableName: this.agendamientoTableName,
        Key: { idAgendamiento: agendamiento.id },
        UpdateExpression: "SET " + updateExpression.join(", "),
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
    );
  }
}

export const agendamientoRepository = DynamoAgendamientoRepository;
