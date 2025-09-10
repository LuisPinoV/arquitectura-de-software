import { Injectable } from '@nestjs/common';
import { IFichaMedicaRepository } from 'src/domain/repositories/ficha-medica.repository';
import { FichaMedica } from 'src/domain/entities/ficha-medica.entity';
import { Client as CassandraClient } from 'cassandra-driver';
import { v4 as uuidv4 } from 'uuid';
import { RevisionMedica } from 'src/domain/entities/serializable-objects/revision-medica';
import { CarnetVacuna } from 'src/domain/entities/serializable-objects/carnet-vacuna';
import { Procedimiento } from 'src/domain/entities/serializable-objects/procedimiento';
import { Medicamento } from 'src/domain/entities/serializable-objects/medicamento';
import { VacunaAdministrada } from 'src/domain/entities/serializable-objects/vacuna';

@Injectable()
export class CassandraFichaMedicaRepository implements IFichaMedicaRepository {
  constructor(private readonly client: CassandraClient) {}

  async FindAllVaccines(): Promise<string[] | null> {
    const query = 'Select nombrevacuna from Vacuna';
    let res = await this.client.execute(query);

    if (!res.rows) return null;

    const vacunas:string[] = []

    res.rows.map((item) => vacunas.push(item.nombrevacuna));

    return vacunas;
  }

  async CreateFicha(ficha: FichaMedica): Promise<void> {
    const id = ficha.getId();
    const idMascota = ficha.getIdMascota();
    const revisiones = ficha.getRevisionesMedicas();
    const carnets = ficha.getVacunas();

    await this.UploadFicha(id, idMascota, revisiones, carnets);
  }

  async FindById(id: string): Promise<FichaMedica | null> {
    let query = 'SELECT * FROM FichaMedica WHERE idFichaMedica = ?';
    let params = [id];

    let res = await this.client.execute(query, params, { prepare: true });

    if (!res.rows) return null;

    const idMascota = res.rows[0].idmascota;

    query = 'SELECT * FROM RevisionMedica WHERE idFicha = ? ALLOW FILTERING';
    params = [id];

    res = await this.client.execute(query, params, { prepare: true });
    if (!res.rows) return null;

    const revisiones = res.rows;

    query =
      'SELECT * FROM CarnetVacuna WHERE idFichaMedica = ? ALLOW FILTERING';
    params = [id];

    res = await this.client.execute(query, params, { prepare: true });
    if (!res.rows) return null;

    const carnets = res.rows;

    return await this.DownloadFicha(id, idMascota, revisiones, carnets);
  }

  async UpdateFicha(ficha: FichaMedica): Promise<void> {
    await this.DeleteFicha(ficha.getId());
    await this.CreateFicha(ficha);
  }

  async DeleteFicha(id: string): Promise<string> {
    const revisiones = await this.client.execute(
      'SELECT idRevision FROM RevisionMedica WHERE idFicha = ? ALLOW FILTERING',
      [id],
      { prepare: true },
    );

    for (const row of revisiones.rows) {
      const idRevision = row.idrevision;

      const procedimientos = await this.client.execute(
        'SELECT idProcedimiento FROM Procedimiento WHERE idRevision = ? ALLOW FILTERING',
        [idRevision],
        { prepare: true },
      );

      for (const proc of procedimientos.rows) {
        const idProcedimiento = proc.idprocedimiento;

        await this.client.execute(
          'DELETE FROM Medicamento WHERE idProcedimiento = ?',
          [idProcedimiento],
          { prepare: true },
        );

        await this.client.execute(
          'DELETE FROM Procedimiento WHERE idRevision = ? AND idProcedimiento = ? ',
          [idRevision, idProcedimiento],
          { prepare: true },
        );
      }

      await this.client.execute(
        'DELETE FROM RevisionMedica WHERE idFicha = ? AND idRevision = ?',
        [id, idRevision],
        { prepare: true },
      );
    }

    const carnets = await this.client.execute(
      'SELECT idCarnet FROM CarnetVacuna WHERE idFichaMedica = ? ALLOW FILTERING',
      [id],
      { prepare: true },
    );

    for (const row of carnets.rows) {
      const idCarnet = row.idcarnet;

      await this.client.execute(
        'DELETE FROM Vacuna WHERE idCarnet = ?',
        [idCarnet],
        { prepare: true },
      );

      await this.client.execute(
        'DELETE FROM CarnetVacuna WHERE idFichaMedica = ? AND idCarnet = ?',
        [id, idCarnet],
        { prepare: true },
      );
    }

    await this.client.execute(
      'DELETE FROM FichaMedica WHERE idFichaMedica = ?',
      [id],
      { prepare: true },
    );

    return 'Finished!';
  }

  async DeleteAll(): Promise<string> {
    let query = 'TRUNCATE FichaMedica';
    let res = await this.client.execute(query);

    query = 'TRUNCATE RevisionMedica';
    res = await this.client.execute(query);

    query = 'TRUNCATE Procedimiento';
    res = await this.client.execute(query);

    query = 'TRUNCATE Medicamento';
    res = await this.client.execute(query);

    query = 'TRUNCATE CarnetVacuna';
    res = await this.client.execute(query);

    query = 'TRUNCATE Vacuna';
    res = await this.client.execute(query);

    const msg = res.wasApplied()
      ? 'All Fichas Medicas deleted'
      : 'No Fichas Medicas deleted';
    return msg;
  }

  async FindAll(): Promise<FichaMedica[] | undefined> {
    const query = 'SELECT * FROM FichaMedica';
    const meta = await this.client.execute(query);

    const fichas: FichaMedica[] = [];

    if(!meta.rows) return undefined;

    for(let i  = 0; i < meta.rows.length; i++)
    {
      const id = meta.rows[i].idfichamedica;
      const idMascota = meta.rows[i].idmascota;

      let query = 'SELECT * FROM RevisionMedica WHERE idFicha = ? ALLOW FILTERING';
      let params = [id];

      let res = await this.client.execute(query, params, { prepare: true });
      if (!res.rows) return undefined;

      const revisiones = res.rows;

      query =
        'SELECT * FROM CarnetVacuna WHERE idFichaMedica = ? ALLOW FILTERING';
      params = [id];

      res = await this.client.execute(query, params, { prepare: true });
      if (!res.rows) return undefined;

      const carnets = res.rows;

      fichas.push(await this.DownloadFicha(id, idMascota, revisiones, carnets));
    }

    return fichas;
    
  }

  async FindByPetId(idMascota: string): Promise<FichaMedica | null> {
    let query = 'SELECT idfichamedica FROM FichaMedica where idmascota = ? ALLOW FILTERING';
    let params = [idMascota];
    let res = await this.client.execute(query, params, { prepare: true });

    if(!res.rows) return null;

    const id = res.rows[0].idfichamedica;

    query = 'SELECT * FROM RevisionMedica WHERE idFicha = ? ALLOW FILTERING';
    params = [id];

    res = await this.client.execute(query, params, { prepare: true });
    if (!res.rows) return null;

    const revisiones = res.rows;

    query =
      'SELECT * FROM CarnetVacuna WHERE idFichaMedica = ? ALLOW FILTERING';
    params = [id];

    res = await this.client.execute(query, params, { prepare: true });
    if (!res.rows) return null;

    const carnets = res.rows;

    return await this.DownloadFicha(id, idMascota, revisiones, carnets);
  }

  async FindAllProceduresMoney(): Promise<
    { procedimiento: string; costo: Number }[] | null
  > {
    const query = 'SELECT descripcion, costo FROM Procedimiento;';
    const res = await this.client.execute(query);

    return res.rows.map((row) => ({
      procedimiento: row.descripcion,
      costo: row.costo,
    }));
  }

  async FindMedsWithQuantity(): Promise<{ medicamento: string; cantidad: Number; }[] | null> {
    const query = 'SELECT nombre, cantidad FROM Medicamento;';
    const res = await this.client.execute(query);

    return res.rows.map((row) => ({
      medicamento: row.nombre,
      cantidad: row.cantidad,
    }));
  }

  async GetMedicosIDs(): Promise<string[] | null> {

    const medicos:string[] = [];

    let query = 'SELECT idmedicos FROM Procedimiento';
    let res = await this.client.execute(query);

    if(res.rows) res.rows.map((row) => (row.idmedicos.map((medico:string) => medicos.push(medico))));

    query = 'SELECT idmedico FROM RevisionMedica';
    res = await this.client.execute(query);
    
    if(res.rows) res.rows.map((row) => (medicos.push(row.idmedico)));

    return medicos;
  }

  async GetRevisionesPagos(): Promise<boolean[] | null> {
    const pagados:boolean[] = [];
    const query = 'SELECT pagado FROM RevisionMedica';

    const res = await this.client.execute(query);
    
    if(res.rows) res.rows.map((row) => (pagados.push(row.pagado)));

    return pagados;
  }

  async UploadFicha(
    id: string,
    idMascota: string,
    revisiones: RevisionMedica[],
    carnets: CarnetVacuna[],
  ) {
    const queryFichaMedica =
      'INSERT INTO FichaMedica (idFichaMedica, idmascota) VALUES (?, ?)';

    const params = [id, idMascota];

    await this.client.execute(queryFichaMedica, params, { prepare: true });

    for (let i = 0; i < revisiones.length; i++) {
      const revision = revisiones[i];

      const queryRevision =
        'INSERT INTO RevisionMedica (idRevision, idFicha, peso, presion, temperatura, fechahora, idmedico, costo, pagado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

      const idRevision = uuidv4();

      const params = [
        idRevision,
        id,
        revision.peso,
        revision.presion,
        revision.temperatura,
        revision.fechahora,
        revision.idmedico,
        revision.costo,
        revision.pagado,
      ];

      await this.client.execute(queryRevision, params, { prepare: true });

      for (let j = 0; j < revision.procedimientos.length; j++) {
        const procedimiento = revision.procedimientos[j];
        const idProcedimiento = uuidv4();

        const queryProc =
          'INSERT INTO Procedimiento (idRevision, idProcedimiento, descripcion, idMedicos, costo) VALUES (?, ?, ?, ?, ?)';
        const params = [
          idRevision,
          idProcedimiento,
          procedimiento.procedimiento,
          procedimiento.idmedicos,
          procedimiento.costo,
        ];

        await this.client.execute(queryProc, params, { prepare: true });

        for (let k = 0; k < procedimiento.medicamentos.length; k++) {
          const medicamento = procedimiento.medicamentos[k];

          const queryMed =
            'INSERT INTO Medicamento (idProcedimiento, nombre, cantidad) VALUES (?, ?, ?)';

          const params = [
            idProcedimiento,
            medicamento.nombre,
            medicamento.cantidad,
          ];

          await this.client.execute(queryMed, params, { prepare: true });
        }
      }
    }

    for (let i = 0; i < carnets.length; i++) {
      const carnet = carnets[i];
      const carnetId = uuidv4();

      const queryCarnet =
        'INSERT INTO CarnetVacuna (idFichaMedica, idCarnet, enfermedad) VALUES (?, ?, ?)';

      const params = [id, carnetId, carnet.enfermedad];
      await this.client.execute(queryCarnet, params, { prepare: true });

      for (let j = 0; j < carnet.vacunasadministradas.length; j++) {
        const vacuna = carnet.vacunasadministradas[j];

        const queryVacuna =
          'INSERT INTO Vacuna (idCarnet, nombreVacuna, fecha) VALUES (?, ?, ?)';

        const params = [carnetId, vacuna.nombrevacuna, vacuna.fecha];
        await this.client.execute(queryVacuna, params, { prepare: true });
      }
    }
  }

  async DownloadFicha(id:string, idMascota:string, revisiones: Record<string, any>[], carnets:Record<string, any>[])
  {
    const mapRevisiones = new Map<string, RevisionMedica>();
    const mapCarnet = new Map<string, CarnetVacuna>();
    const mapProcedimientos = new Map<string, Procedimiento>();

    for (let i = 0; i < revisiones.length; i++) {
      const revision = revisiones[i];

      const idRevision = revision.idrevision;

      const revisionObj = new RevisionMedica();
      revisionObj.costo = revision.costo;
      revisionObj.fechahora = revision.fechahora;
      revisionObj.pagado = revision.pagado;
      revisionObj.peso = revision.peso;
      revisionObj.presion = revision.presion;
      revisionObj.temperatura = revision.temperatura;
      revisionObj.idmedico = revision.idmedico;
      revisionObj.procedimientos = [];

      mapRevisiones.set(idRevision, revisionObj);

      let query =
        'SELECT * FROM Procedimiento WHERE idRevision = ? ALLOW FILTERING';
      let params = [idRevision];

      let res = await this.client.execute(query, params, { prepare: true });
      if (!res.rows) continue;

      const procedimientos = res.rows;

      for (let j = 0; j < procedimientos.length; j++) {
        const curProc = procedimientos[j];

        const procedimiento = new Procedimiento();
        procedimiento.costo = curProc.costo;
        procedimiento.procedimiento = curProc.descripcion;
        procedimiento.idmedicos = curProc.idmedicos;
        procedimiento.medicamentos = [];

        const idProcedimiento = curProc.idprocedimiento;
        mapProcedimientos.set(idProcedimiento, procedimiento);

        const revisionFromMap = mapRevisiones.get(idRevision);

        if (revisionFromMap) {
          revisionFromMap.procedimientos.push(procedimiento);
        }

        query =
          'SELECT * FROM Medicamento WHERE idprocedimiento = ? ALLOW FILTERING';
        params = [idProcedimiento];

        res = await this.client.execute(query, params, { prepare: true });
        if (!res.rows) continue;

        const medicamentos = res.rows;
        for (let k = 0; k < medicamentos.length; k++) {
          const curMed = medicamentos[k];
          const medicamento = new Medicamento();
          medicamento.cantidad = curMed.cantidad;
          medicamento.nombre = curMed.nombre;

          const procedimiento = mapProcedimientos.get(idProcedimiento);

          if (procedimiento) {
            procedimiento.medicamentos.push(medicamento);
          }
        }
      }
    }

    for (let i = 0; i < carnets.length; i++) {
      const carnet = carnets[i];

      const idCarnet = carnet.idcarnet;

      const carnetObj = new CarnetVacuna(carnet.enfermedad, []);

      mapCarnet.set(idCarnet, carnetObj);

      let query = 'SELECT * FROM Vacuna WHERE idcarnet = ? ALLOW FILTERING';
      let params = [idCarnet];

      let res = await this.client.execute(query, params, { prepare: true });
      if (!res.rows) continue;

      const vacunas = res.rows;

      for (let j = 0; j < vacunas.length; j++) {
        const curVacuna = vacunas[j];

        const vacuna = new VacunaAdministrada();
        vacuna.fecha = curVacuna.fecha;
        vacuna.nombrevacuna = curVacuna.nombrevacuna;

        const carnet = mapCarnet.get(idCarnet);

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
