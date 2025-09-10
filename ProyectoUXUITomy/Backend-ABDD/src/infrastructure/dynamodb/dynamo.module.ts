import { Module } from '@nestjs/common';
import { DBConfigModule } from 'src/db-config.module';
import { DynamoPacienteRepository } from './paciente.repository.dynamo';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoMedicoRepository } from './medico.repository.dynamo';
import { DynamoTutorRepository } from './tutor.repository.dynamo';
import { DynamoFichaMedicaRepository } from './ficha-medica.repository.dynamo';

@Module({
  imports: [DBConfigModule],
  providers: [
    {
      provide: DynamoPacienteRepository,
      useFactory: (client: DynamoDBDocumentClient) =>
        new DynamoPacienteRepository(client),
      inject: ['DYNAMO_CLIENT'],
    },
    {
      provide: DynamoMedicoRepository,
      useFactory: (client: DynamoDBDocumentClient) =>
        new DynamoMedicoRepository(client),
      inject: ['DYNAMO_CLIENT'],
    },
    {
      provide: DynamoTutorRepository,
      useFactory: (client: DynamoDBDocumentClient) =>
        new DynamoTutorRepository(client),
      inject: ['DYNAMO_CLIENT'],
    },
    {
      provide: DynamoFichaMedicaRepository,
      useFactory: (client: DynamoDBDocumentClient) =>
        new DynamoFichaMedicaRepository(client),
      inject: ['DYNAMO_CLIENT'],
    },
  ],
  exports: [
    DynamoPacienteRepository,
    DynamoMedicoRepository,
    DynamoTutorRepository,
    DynamoFichaMedicaRepository
  ],
})
export class DynamoDBModule {}
