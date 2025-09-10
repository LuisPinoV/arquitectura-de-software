import { Module } from '@nestjs/common';
import { Client as CassandraClient } from 'cassandra-driver';
import { DBConfigModule } from 'src/db-config.module';
import { CassandraTutorRepository } from './tutor.repository.cassandra';
import { CassandraMedicoRepository } from './medico.repository.cassandra';
import { CassandraPacienteRepository } from './paciente.repository.cassandra';
import { CassandraFichaMedicaRepository } from './ficha-medica.repository.cassandra';

@Module({
  imports: [DBConfigModule],
  providers: [
    {
      provide: CassandraTutorRepository,
      useFactory: (client: CassandraClient) =>
        new CassandraTutorRepository(client),
      inject: ['CASSANDRA_CLIENT'],
    },
    {
      provide: CassandraMedicoRepository,
      useFactory: (client: CassandraClient) =>
        new CassandraMedicoRepository(client),
      inject: ['CASSANDRA_CLIENT'],
    },
    {
      provide: CassandraPacienteRepository,
      useFactory: (client: CassandraClient) =>
        new CassandraPacienteRepository(client),
      inject: ['CASSANDRA_CLIENT'],
    },
    {
      provide: CassandraFichaMedicaRepository,
      useFactory: (client: CassandraClient) =>
        new CassandraFichaMedicaRepository(client),
      inject: ['CASSANDRA_CLIENT'],
    },
  ],
  exports: [
    CassandraTutorRepository,
    CassandraMedicoRepository,
    CassandraPacienteRepository,
    CassandraFichaMedicaRepository,
  ],
})
export class CassandraModule {}
