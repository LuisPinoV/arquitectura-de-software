import { Injectable } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  ScanCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { IMedicoRepository } from 'src/domain/repositories/medico.repository';
import { Medico } from 'src/domain/entities/medico.entity';

@Injectable()
export class DynamoMedicoRepository implements IMedicoRepository {
  constructor(private readonly client: DynamoDBDocumentClient) {}

  private readonly tableName = 'Medico';

  async CreateMedico(medico: Medico): Promise<void> {
    const doc = {
      idMedico: medico.getId(),
      nombre: medico.getNombre(),
      estado: medico.getEstado(),
      especialidad: medico.getEspecialidad()
    };

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: doc,
      }),
    );
  }

  async FindById(id: string): Promise<Medico | null> {
    const res = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { idMedico: id },
      }),
    );

    const doc = res.Item;

    return doc
      ? new Medico(
          doc.idMedico,
          doc.nombre,
          doc.estado,
          doc.especialidad,
        )
      : null;
  }
  async UpdateMedico(medico: Medico): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { idMedico: medico.getId() },
        UpdateExpression:
          'SET nombre = :nombre, estado = :estado, especialidad = :especialidad',
        ExpressionAttributeValues: {
          ':nombre': medico.getNombre(),
          ':estado': medico.getEstado(),
          ':especialidad': medico.getEspecialidad(),
        },
      }),
    );
  }

  async DeleteMedico(id: string): Promise<string> {
    const res = await this.client.send(
      new GetCommand({ TableName: this.tableName, Key: { idMedico: id } }),
    );

    const doc = res.Item;

    if (!doc) return 'Medico not found';

    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { idMedico: id },
      }),
    );

    return "Medico removed";
  }

  async DeleteAll(): Promise<string> {
    const res = await this.client.send(
      new ScanCommand({ TableName: this.tableName }),
    );

    const items = res.Items || [];

    if (items.length === 0) return 'No medicos found on the database';

    for (const item of items) {
      await this.client.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: { idMedico: item.idMedico },
        }),
      );
    }
    return `Removed ${items.length} medicos`;
  }

  async FindAll(): Promise<Medico[] | undefined> {
    const result = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );

    return (result.Items || []).map(
      (item) =>
        new Medico(
          item.idMedico,
          item.nombre,
          item.estado,
          item.especialidad
        ),
    );
  }
}
