import { Injectable } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  ScanCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { IPacienteRepository } from 'src/domain/repositories/paciente.repository';
import { Paciente } from 'src/domain/entities/paciente.entity';

@Injectable()
export class DynamoPacienteRepository implements IPacienteRepository {
  constructor(private readonly client: DynamoDBDocumentClient) {}

  private readonly tableName = 'Paciente';

  async CreatePaciente(paciente: Paciente): Promise<void> {
    const doc = {
      idPaciente: paciente.getId(),
      nombre: paciente.getNombre(),
      tutor: paciente.getTutor(),
      raza: paciente.getRaza(),
      edad: paciente.getEdad(),
      especie: paciente.getEspecie(),
      genero: paciente.getGenero(),
    };

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: doc,
      }),
    );
  }

  async FindById(id: string): Promise<Paciente | null> {
    const res = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { idPaciente: id },
      }),
    );

    const doc = res.Item;

    return doc
      ? new Paciente(
          doc.idPaciente,
          doc.tutor,
          doc.nombre,
          doc.raza,
          doc.edad,
          doc.especie,
          doc.genero,
        )
      : null;
  }
  async UpdatePaciente(paciente: Paciente): Promise<void> {
    await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { idPaciente: paciente.getId() },
        UpdateExpression:
          'SET nombre = :nombre, tutor = :tutor, raza = :raza, especie = :especie, genero = :genero, edad = :edad',
        ExpressionAttributeValues: {
          ':nombre': paciente.getNombre(),
          ':tutor': paciente.getTutor(),
          ':raza': paciente.getRaza(),
          ':especie': paciente.getEdad(),
          ':genero': paciente.getGenero(),
          ':edad': paciente.getEdad(),
        },
      }),
    );
  }

  async DeletePaciente(id: string): Promise<string> {
    const res = await this.client.send(
      new GetCommand({ TableName: this.tableName, Key: { idPaciente: id } }),
    );

    const doc = res.Item;

    if (!doc) return 'Patient not found';

    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { idPaciente: id },
      }),
    );

    return "Patient removed";
  }

  async DeleteAll(): Promise<string> {
    const res = await this.client.send(
      new ScanCommand({ TableName: this.tableName }),
    );

    const items = res.Items || [];

    if (items.length === 0) return 'No patients found on the database';

    for (const item of items) {
      await this.client.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: { idPaciente: item.idPaciente },
        }),
      );
    }
    return `Removed ${items.length} patients`;
  }

  async FindAll(): Promise<Paciente[] | undefined> {
    const result = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );

    return (result.Items || []).map(
      (item) =>
        new Paciente(
          item.idPaciente,
          item.tutor,
          item.nombre,
          item.raza,
          item.edad,
          item.especie,
          item.genero,
        ),
    );
  }
}
