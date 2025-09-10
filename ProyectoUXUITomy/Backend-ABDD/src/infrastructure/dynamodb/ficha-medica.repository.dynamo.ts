import { Injectable } from '@nestjs/common';
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  DeleteCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { IFichaMedicaRepository } from 'src/domain/repositories/ficha-medica.repository';
import { FichaMedica } from 'src/domain/entities/ficha-medica.entity';
import { Procedimiento } from 'src/domain/entities/serializable-objects/procedimiento';
import { Medicamento } from 'src/domain/entities/serializable-objects/medicamento';
import { RevisionMedica } from 'src/domain/entities/serializable-objects/revision-medica';
import { CarnetVacuna } from 'src/domain/entities/serializable-objects/carnet-vacuna';
import { VacunaAdministrada } from 'src/domain/entities/serializable-objects/vacuna';

@Injectable()
export class DynamoFichaMedicaRepository implements IFichaMedicaRepository {
  constructor(private readonly client: DynamoDBDocumentClient) {}

  private readonly tableName = 'FichaMedica';

  async FindAllVaccines(): Promise<string[] | null> {
    const res = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'contains(SK, :vacuna)',
        ExpressionAttributeValues: {
          ':vacuna': '#VacunasAdministradas',
        },
        ProjectionExpression: 'nombrevacuna',
      }),
    );

    if (!res.Items) return null;

    const vacunas = res.Items.map((item) => item.nombrevacuna);

    return vacunas;
  }

  async CreateFicha(fichaMedica: FichaMedica): Promise<void> {
    const metaItem = {
      idFichaMedica: fichaMedica.getId(),
      SK: 'META',
      idMascota: fichaMedica.getIdMascota(),
    };

    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: metaItem,
      }),
    );

    await this.UploadRevisiones(
      fichaMedica.getId(),
      fichaMedica.getRevisionesMedicas(),
    );
    await this.UploadCarnetVacunas(
      fichaMedica.getId(),
      fichaMedica.getVacunas(),
    );
  }

  async FindById(id: string): Promise<FichaMedica | null> {
    const resMetaData = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'idFichaMedica = :id AND SK = :sk',
        ExpressionAttributeValues: {
          ':id': id,
          ':sk': 'META',
        },
      }),
    );

    if (!resMetaData.Items || resMetaData.Items.length === 0) return null;

    const meta = resMetaData.Items[0];

    const revisiones = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression:
          'idFichaMedica = :id AND begins_with(SK, :prefix)',
        ExpressionAttributeValues: {
          ':id': id,
          ':prefix': 'RevisionMedica#',
        },
      }),
    );

    const carnetVacunas = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression:
          'idFichaMedica = :id AND begins_with(SK, :prefix)',
        ExpressionAttributeValues: {
          ':id': id,
          ':prefix': 'CarnetVacunas#',
        },
      }),
    );

    if (!revisiones.Items || !carnetVacunas.Items) return null;

    const revisionesItems = revisiones.Items;
    const carnetItems = carnetVacunas.Items;

    return this.GetFichaMedicaFromQuery(
      meta.id,
      meta.idMascota,
      revisionesItems,
      carnetItems,
    );
  }

  async UpdateFicha(ficha: FichaMedica): Promise<void> {
    await this.DeleteFicha(ficha.getId());
    await this.CreateFicha(ficha);
  }

  async DeleteFicha(id: string): Promise<string> {
    const res = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'idFichaMedica = :pk',
        ExpressionAttributeValues: {
          ':pk': id,
        },
      }),
    );

    const doc = res.Items;

    if (!doc) return 'Ficha Medica not found';

    for (const item of doc) {
      await this.client.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: { idFichaMedica: item.idFichaMedica, SK: item.SK },
        }),
      );
    }

    return 'Ficha Medica removed';
  }

  async DeleteAll(): Promise<string> {
    const res = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );

    const items = res.Items || [];

    if (items.length === 0) return 'No Fichas Medicas found on the database';

    for (const item of items) {
      await this.client.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: { idFichaMedica: item.idFichaMedica, SK: item.SK },
        }),
      );
    }
    return `Removed ${items.length} fichas medicas`;
  }

  async FindAll(): Promise<FichaMedica[] | undefined> {
    const resMetaData = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'SK = :meta',
        ExpressionAttributeValues: {
          ':meta': 'META',
        },
        ProjectionExpression: 'idFichaMedica',
      }),
    );

    if (!resMetaData.Items) return undefined;

    const fichasMedicas: FichaMedica[] = [];

    for (let i = 0; i < resMetaData.Items.length; i++) {
      const meta = resMetaData.Items[i];

      const revisiones = await this.client.send(
        new QueryCommand({
          TableName: this.tableName,
          KeyConditionExpression:
            'idFichaMedica = :id AND begins_with(SK, :prefix)',
          ExpressionAttributeValues: {
            ':id': meta.idFichaMedica,
            ':prefix': 'RevisionMedica#',
          },
        }),
      );

      const carnetVacunas = await this.client.send(
        new QueryCommand({
          TableName: this.tableName,
          KeyConditionExpression:
            'idFichaMedica = :id AND begins_with(SK, :prefix)',
          ExpressionAttributeValues: {
            ':id': meta.idFichaMedica,
            ':prefix': 'CarnetVacunas#',
          },
        }),
      );

      if (!revisiones.Items || !carnetVacunas.Items) continue;

      const revisionesItems = revisiones.Items;
      const carnetItems = carnetVacunas.Items;

      fichasMedicas.push(
        this.GetFichaMedicaFromQuery(
          meta.id,
          meta.idMascota,
          revisionesItems,
          carnetItems,
        ),
      );
    }
    return fichasMedicas;
  }

  async FindByPetId(idMascota: string): Promise<FichaMedica | null> {
    const res = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'idMascota-index',
        KeyConditionExpression: 'idMascota = :idMascota',
        ExpressionAttributeValues: {
          ':idMascota': idMascota,
        },
      }),
    );

    if (!res.Items) return null;

    const meta = res.Items.find((item) => item.SK === 'META');

    if (!meta) return null;

    const revisiones = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression:
          'idFichaMedica = :id AND begins_with(SK, :prefix)',
        ExpressionAttributeValues: {
          ':id': meta.idFichaMedica,
          ':prefix': 'RevisionMedica#',
        },
      }),
    );

    const carnet = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression:
          'idFichaMedica = :id AND begins_with(SK, :prefix)',
        ExpressionAttributeValues: {
          ':id': meta.idFichaMedica,
          ':prefix': 'CarnetVacunas#',
        },
      }),
    );

    if (!revisiones.Items || !carnet.Items) return null;

    return this.GetFichaMedicaFromQuery(
      meta.id,
      meta.idMascota,
      revisiones.Items,
      carnet.Items,
    );
  }

  async FindAllProceduresMoney(): Promise<
    { procedimiento: string; costo: Number }[] | null
  > {
    const res = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression:
          'contains(SK, :procedure) AND NOT contains(SK, :medicamento) AND NOT contains(SK, :idmedico)',
        ExpressionAttributeValues: {
          ':procedure': '#Procedimiento',
          ':medicamento': '#Medicamento',
          ':idmedico': '#idMedico',
        },
        ProjectionExpression: 'procedimiento, costo',
      }),
    );

    const procedimientos =
      res.Items?.map((item) => ({
        procedimiento: item.procedimiento,
        costo: item.costo,
      })) ?? null;

    return procedimientos;
  }

  async FindMedsWithQuantity(): Promise<
    { medicamento: string; cantidad: Number }[] | null
  > {
    const res = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'contains(SK, :medicamento)',
        ExpressionAttributeValues: {
          ':medicamento': '#Medicamento',
        },
        ProjectionExpression: 'nombre, cantidad',
      }),
    );

    if (!res.Items) return null;

    const meds = res.Items.map((item) => ({
      medicamento: item.nombre,
      cantidad: item.cantidad,
    }));

    return meds;
  }

  async GetMedicosIDs(): Promise<string[] | null> {
    const medicos: string[] = [];

    let res = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'contains(SK, :revisionMedica)',
        ExpressionAttributeValues: {
          ':revisionMedica': 'RevisionMedica#',
        },
        ProjectionExpression: 'idmedico',
      }),
    );

    if (!res.Items) return null;
    if (res.Items.length === 0) return null;

    res.Items.forEach((item) => {
      if (item.idmedico !== undefined) {
        medicos.push(item.idmedico);
      }
    });

    return medicos;
  }

  async GetRevisionesPagos(): Promise<boolean[] | null> {
    const pagados:boolean[] = [];

    const res = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'contains(SK, :revisionMedica)',
        ExpressionAttributeValues: {
          ':revisionMedica': 'RevisionMedica#',
        },
        ProjectionExpression: 'pagado',
      }),
    );

    if (!res.Items) return null;
    if (res.Items.length === 0) return null;
    
    res.Items.forEach((item) => {
      if (item.pagado !== undefined) {
        pagados.push(item.pagado);
      }
    });

    return pagados;
  }

  async UploadRevisiones(id: string, revisiones: RevisionMedica[]) {
    for (let i = 0; i < revisiones.length; i++) {
      const curRevision = revisiones[i];

      const revisionItem = {
        idFichaMedica: id,
        SK: `RevisionMedica#${i}`,
        peso: curRevision.peso,
        presion: curRevision.presion,
        temperatura: curRevision.temperatura,
        fechahora: curRevision.fechahora.toISOString(),
        idmedico: curRevision.idmedico,
        costo: curRevision.costo,
        pagado: curRevision.pagado,
      };

      await this.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: revisionItem,
        }),
      );

      await this.UploadProcedimientos(i, id, curRevision.procedimientos);
    }
  }

  async UploadProcedimientos(
    revision: number,
    id: string,
    procedimientos: Procedimiento[],
  ) {
    for (let i = 0; i < procedimientos.length; i++) {
      const curProc = procedimientos[i];

      const procItem = {
        idFichaMedica: id,
        SK: `RevisionMedica#${revision}#Procedimiento#${i}`,
        procedimiento: curProc.procedimiento,
        costo: curProc.costo,
      };

      await this.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: procItem,
        }),
      );

      await this.UploadMedicos(revision, i, id, curProc.idmedicos);
      await this.UploadMedicamentos(revision, i, id, curProc.medicamentos);
    }
  }

  async UploadMedicos(
    revision: number,
    procedimiento: number,
    id: string,
    medicos: string[],
  ) {
    for (let i = 0; i < medicos.length; i++) {
      const curIdMedico = medicos[i];

      const idMedicoItem = {
        idFichaMedica: id,
        SK: `RevisionMedica#${revision}#Procedimiento#${procedimiento}#idMedico#${i}`,
        idmedico: curIdMedico,
      };

      await this.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: idMedicoItem,
        }),
      );
    }
  }

  async UploadMedicamentos(
    revision: number,
    procedimiento: number,
    id: string,
    medicamentos: Medicamento[],
  ) {
    for (let i = 0; i < medicamentos.length; i++) {
      const curMedicamento = medicamentos[i];

      const medicamentoItem = {
        idFichaMedica: id,
        SK: `RevisionMedica#${revision}#Procedimiento#${procedimiento}#Medicamento#${i}`,
        nombre: curMedicamento.nombre,
        cantidad: curMedicamento.cantidad,
      };

      await this.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: medicamentoItem,
        }),
      );
    }
  }

  async UploadCarnetVacunas(id: string, vacunas: CarnetVacuna[]) {
    for (let i = 0; i < vacunas.length; i++) {
      const curCarnet = vacunas[i];

      const vacunaItem = {
        idFichaMedica: id,
        SK: `CarnetVacunas#${i}`,
        enfermedad: curCarnet.enfermedad,
      };

      await this.client.send(
        new PutCommand({
          TableName: this.tableName,
          Item: vacunaItem,
        }),
      );

      for (let j = 0; j < curCarnet.vacunasadministradas.length; j++) {
        const curVacuna = curCarnet.vacunasadministradas[j];

        const vacunaItem = {
          idFichaMedica: id,
          SK: `CarnetVacunas#${i}#VacunasAdministradas#${j}`,
          nombrevacuna: curVacuna.nombrevacuna,
          fecha: curVacuna.fecha.toISOString(),
        };

        await this.client.send(
          new PutCommand({
            TableName: this.tableName,
            Item: vacunaItem,
          }),
        );
      }
    }
  }

  private GetFichaMedicaFromQuery(
    id: string,
    idMascota,
    revisionesItems: Record<string, any>[],
    carnetItems: Record<string, any>[],
  ): FichaMedica {
    const mapRevisiones = new Map<string, RevisionMedica>();
    const mapCarnet = new Map<string, CarnetVacuna>();
    const mapProcedimientos = new Map<string, Procedimiento>();

    for (let i = 0; i < revisionesItems.length; i++) {
      const item = revisionesItems[i];

      const sk: string = item.SK;

      //Tests if the sk looks like this (the RevisionMedica#ID pattern) using regex, so to know we are dealing with revisiones
      //Comment to learn more than anything, never used regex before so is nice to learn what this below does.
      if (/^RevisionMedica#[^#]+$/.test(sk)) {
        const revisionId = sk.split('#')[1];

        const revision = new RevisionMedica();
        revision.peso = item.peso;
        revision.presion = item.presion;
        revision.temperatura = item.temperatura;
        revision.fechahora = new Date(item.fechahora);
        revision.idmedico = item.idmedico;
        revision.costo = item.costo;
        revision.pagado = item.pagado;
        revision.procedimientos = [];

        mapRevisiones.set(revisionId, revision);
      }

      // Now for, procedimiento, since we saved it as, RevisionMedica#ID#Procedimiento#ID, we also do a regex
      // Sidenote: Didnt think i would learn something this new that works at such a "basic" level, kind of want to use it for other things
      else if (/^RevisionMedica#[^#]+#Procedimiento#[^#]+$/.test(sk)) {
        const parts = sk.split('#');

        const revisionId = parts[1];
        const procedimientoId = revisionId.concat('#', parts[3]);

        const procedimiento = new Procedimiento();

        procedimiento.procedimiento = item.procedimiento;
        procedimiento.costo = item.costo;
        procedimiento.idmedicos = [];
        procedimiento.medicamentos = [];

        const revision = mapRevisiones.get(revisionId);

        if (revision) {
          revision.procedimientos.push(procedimiento);
        }

        mapProcedimientos.set(procedimientoId, procedimiento);
      }

      //Medicamentos is next!
      else if (
        /^RevisionMedica#[^#]+#Procedimiento#[^#]+#Medicamento#[^#]+$/.test(sk)
      ) {
        const parts = sk.split('#');

        const revisionId = parts[1];
        const procedimientoId = revisionId.concat('#', parts[3]);

        const medicamento = new Medicamento();
        medicamento.cantidad = item.cantidad;
        medicamento.nombre = item.nombre;

        const procedimiento = mapProcedimientos.get(procedimientoId);

        if (procedimiento) {
          procedimiento.medicamentos.push(medicamento);
        }
      }

      //Medicos!
      else if (
        /^RevisionMedica#[^#]+#Procedimiento#[^#]+#idMedico#[^#]+$/.test(sk)
      ) {
        const parts = sk.split('#');

        const revisionId = parts[1];
        const procedimientoId = revisionId.concat('#', parts[3]);

        const procedimiento = mapProcedimientos.get(procedimientoId);

        if (procedimiento) {
          procedimiento.idmedicos.push(item.idmedico);
        }
      }
    }

    for (let i = 0; i < carnetItems.length; i++) {
      const item = carnetItems[i];
      const sk: string = item.SK;

      //Now, carnet de vacunas!
      if (/^CarnetVacunas#[^#]+$/.test(sk)) {
        const carnetId = sk.split('#')[1];

        const carnet = new CarnetVacuna(item.enfermedad, []);

        mapCarnet.set(carnetId, carnet);
      }

      //And finally, vacunas!
      else if (/^CarnetVacunas#[^#]+#VacunasAdministradas#[^#]+$/.test(sk)) {
        const carnetId = sk.split('#')[1];

        const vacuna = new VacunaAdministrada();
        vacuna.fecha = new Date(item.fecha);
        vacuna.nombrevacuna = item.nombrevacuna;

        const carnet = mapCarnet.get(carnetId);

        if (carnet) {
          carnet.vacunasadministradas.push(vacuna);
        }
      }
    }

    return new FichaMedica(
      id,
      idMascota,
      Array.from(mapRevisiones.values()),
      Array.from(mapCarnet.values()),
    );
  }
}
