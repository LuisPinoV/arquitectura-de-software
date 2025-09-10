import { Injectable } from '@nestjs/common';
import { IMedicoRepository } from 'src/domain/repositories/medico.repository';
import { Medico } from 'src/domain/entities/medico.entity';
import { Client as CassandraClient } from 'cassandra-driver';

@Injectable()
export class CassandraMedicoRepository implements IMedicoRepository {
  constructor(private readonly client: CassandraClient) {}
  async CreateMedico(medico: Medico): Promise<void> {
    const query = 'INSERT INTO medico (id, nombre, estado, especialidad) VALUES (?, ?, ?, ?)';
    const params = [medico.getId(), medico.getNombre(), medico.getEstado(), medico.getEspecialidad()];
    await this.client.execute(query, params, {prepare:true});
  }

  async FindById(id: string): Promise<Medico | null> {
    const query = 'SELECT * FROM medico WHERE id = ?';
    const params = [id];

    const res = await this.client.execute(query, params, { prepare:true });

    const medico = res ? new Medico(res.rows[0].id, res.rows[0].nombre, res.rows[0].estado, res.rows[0].especialidad) : null;

    return medico;
  }

  async UpdateMedico(medico: Medico): Promise<void> {
    const query = 'UPDATE medico SET nombre = ?, estado = ?, especialidad = ? WHERE id = ?';
    const params = [medico.getNombre(), medico.getEstado(), medico.getEspecialidad(), medico.getId()];

    await this.client.execute(query, params, { prepare:true });
  }

  async DeleteMedico(id: string): Promise<string> {
    const query = 'DELETE FROM medico WHERE id = ?'
    const params = [id];
    const res = await this.client.execute(query, params, { prepare:true });

    const msg = res.wasApplied() ? "Medico deleted" : "No medico found to delete";
    return msg;
  }

  async DeleteAll(): Promise<string> {
    const query = 'TRUNCATE medico';
    const res = await this.client.execute(query);

    const msg = res.wasApplied() ? "All Medicos deleted" : "No medicos deleted";
    return msg;
  }

  async FindAll(): Promise<Medico[] | undefined> {
    const query = 'SELECT * FROM medico';
    const res = await this.client.execute(query);

    return res.rows.map((row) => new Medico(row.id, row.nombre, row.estado, row.especialidad));
  }
}
