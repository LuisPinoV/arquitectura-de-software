import { Injectable } from '@nestjs/common';
import { IPacienteRepository } from 'src/domain/repositories/paciente.repository';
import { Paciente } from 'src/domain/entities/paciente.entity';
import { Client as CassandraClient } from 'cassandra-driver';

@Injectable()
export class CassandraPacienteRepository implements IPacienteRepository {
  constructor(private readonly client: CassandraClient) {}
  async CreatePaciente(paciente: Paciente): Promise<void> {
    const query =
      'INSERT INTO paciente (id, idTutor, nombre, raza, edad, especie, genero) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const params = [
      paciente.getId(),
      paciente.getTutor(),
      paciente.getNombre(),
      paciente.getRaza(),
      paciente.getEdad(),
      paciente.getEspecie(),
      paciente.getGenero(),
    ];
    await this.client.execute(query, params, { prepare: true });
  }

  async FindById(id: string): Promise<Paciente | null> {
    const query = 'SELECT * FROM paciente WHERE id = ?';
    const params = [id];

    const res = await this.client.execute(query, params, { prepare: true });

    const medico = res
      ? new Paciente(
          res.rows[0].id,
          res.rows[0].idTutor,
          res.rows[0].nombre,
          res.rows[0].raza,
          res.rows[0].edad,
          res.rows[0].especie,
          res.rows[0].genero,
        )
      : null;

    return medico;
  }

  async UpdatePaciente(paciente: Paciente): Promise<void> {
    const query =
      'UPDATE paciente SET idTutor = ?, nombre = ?, raza = ?, edad = ?, especie = ?, genero = ? WHERE id = ?';
    const params = [
      paciente.getTutor(),
      paciente.getNombre(),
      paciente.getRaza(),
      paciente.getEdad(),
      paciente.getEspecie(),
      paciente.getGenero(),
      paciente.getId(),
    ];

    await this.client.execute(query, params, { prepare: true });
  }

  async DeletePaciente(id: string): Promise<string> {
    const query = 'DELETE FROM paciente WHERE id = ?';
    const params = [id];
    const res = await this.client.execute(query, params, { prepare: true });

    const msg = res.wasApplied()
      ? 'Paciente deleted'
      : 'No paciente found to delete';
    return msg;
  }

  async DeleteAll(): Promise<string> {
    const query = 'TRUNCATE paciente';
    const res = await this.client.execute(query);

    const msg = res.wasApplied()
      ? 'All Pacientes deleted'
      : 'No Pacientes deleted';
    return msg;
  }

  async FindAll(): Promise<Paciente[] | undefined> {
    const query = 'SELECT * FROM paciente';
    const res = await this.client.execute(query);

    return res.rows.map(
      (row) =>
        new Paciente(
          row.id,
          row.idTutor,
          row.nombre,
          row.raza,
          row.edad,
          row.especie,
          row.genero,
        ),
    );
  }
}
