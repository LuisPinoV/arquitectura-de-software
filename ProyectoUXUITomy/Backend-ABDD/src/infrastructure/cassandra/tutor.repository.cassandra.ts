import { Injectable } from '@nestjs/common';
import { ITutorRepository } from 'src/domain/repositories/tutor.repository';
import { Tutor } from 'src/domain/entities/tutor.entity';
import { Client as CassandraClient } from 'cassandra-driver';

@Injectable()
export class CassandraTutorRepository implements ITutorRepository {
  constructor(private readonly client: CassandraClient) {}
  async CreateTutor(tutor: Tutor): Promise<void> {
    const query = 'INSERT INTO tutor (id, nombre, idmascotas) VALUES (?, ?, ?)';
    const params = [tutor.getId(), tutor.getNombre(), tutor.getMascotas()];
    await this.client.execute(query, params, {prepare:true});
  }

  async FindById(id: string): Promise<Tutor | null> {
    const query = 'SELECT * FROM tutor WHERE id = ?';
    const params = [id];

    const res = await this.client.execute(query, params, { prepare:true });

    const tutor = res ? new Tutor(res.rows[0].id, res.rows[0].nombre, res.rows[0].idmascotas) : null;

    return tutor;
  }

  async UpdateTutor(tutor: Tutor): Promise<void> {
    const query = 'UPDATE tutor SET nombre = ?, idmascotas = ? WHERE id = ?';
    const params = [tutor.getNombre(), tutor.getMascotas(), tutor.getId()];

    await this.client.execute(query, params, { prepare:true });
  }

  async DeleteTutor(id: string): Promise<string> {
    const query = 'DELETE FROM tutor WHERE id = ?'
    const params = [id];
    const res = await this.client.execute(query, params, { prepare:true });

    const msg = res.wasApplied() ? "Tutor deleted" : "No tutor fount to delete";
    return msg;
  }

  async DeleteAll(): Promise<string> {
    const query = 'TRUNCATE tutor';
    const res = await this.client.execute(query);

    const msg = res.wasApplied() ? "All Tutores deleted" : "No tutores deleted";
    return msg;
  }

  async FindAll(): Promise<Tutor[] | undefined> {
    const query = 'SELECT * FROM tutor';
    const res = await this.client.execute(query);

    return res.rows.map((row) => new Tutor(row.id, row.nombre, row.idmascotas));
  }

  async MascotasTotales(): Promise<Number[] | null> {
    const query = 'SELECT idmascotas FROM Tutor';

    const res = await this.client.execute(query);
    const mascotas = res.rows.map((row) => row.idmascotas.length)

    return mascotas;
  }
}
