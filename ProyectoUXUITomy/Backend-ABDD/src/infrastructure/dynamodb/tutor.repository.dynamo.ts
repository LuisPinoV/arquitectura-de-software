import { Injectable } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  ScanCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { ITutorRepository } from 'src/domain/repositories/tutor.repository';
import { Tutor } from 'src/domain/entities/tutor.entity';

@Injectable()
export class DynamoTutorRepository implements ITutorRepository {
  constructor(private readonly client: DynamoDBDocumentClient) {}

  private readonly tableName = 'Tutor';

  async CreateTutor(tutor: Tutor): Promise<void> {
    const doc = {
      idTutor: tutor.getId(),
      nombre: tutor.getNombre(),
      mascotas: tutor.getMascotas(),
    };

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: doc,
      }),
    );
  }

  async FindById(id: string): Promise<Tutor | null> {
    const res = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { idTutor: id },
      }),
    );

    const doc = res.Item;

    return doc
      ? new Tutor(
          doc.idTutor,
          doc.nombre,
          doc.mascotas,
        )
      : null;
  }
  async UpdateTutor(tutor: Tutor): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { idTutor: tutor.getId() },
        UpdateExpression:
          'SET nombre = :nombre, mascotas = :mascotas',
        ExpressionAttributeValues: {
          ':nombre': tutor.getNombre(),
          ':mascotas': tutor.getMascotas(),
        },
      }),
    );
  }

  async DeleteTutor(id: string): Promise<string> {
    const res = await this.client.send(
      new GetCommand({ TableName: this.tableName, Key: { idTutor: id } }),
    );

    const doc = res.Item;

    if (!doc) return 'Tutor not found';

    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { idTutor: id },
      }),
    );

    return "Tutor removed";
  }

  async DeleteAll(): Promise<string> {
    const res = await this.client.send(
      new ScanCommand({ TableName: this.tableName }),
    );

    const items = res.Items || [];

    if (items.length === 0) return 'No tutores found on the database';

    for (const item of items) {
      await this.client.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: { idTutor: item.idTutor },
        }),
      );
    }
    return `Removed ${items.length} tutores`;
  }

  async FindAll(): Promise<Tutor[] | undefined> {
    const result = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );

    return (result.Items || []).map(
      (item) =>
        new Tutor(
          item.idMedico,
          item.nombre,
          item.mascotas
        ),
    );
  }

  async MascotasTotales(): Promise<Number[] | null> {
    const result = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );

    return (result.Items || []).map(
      (item) =>
        item.mascotas.length,
    );
  }
}
