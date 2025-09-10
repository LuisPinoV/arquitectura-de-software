import { Module, OnModuleInit } from '@nestjs/common';
import { PacienteRepositoryRegistry } from '../paciente/paciente-repo.registry';
import { MongoPacienteRepository } from 'src/infrastructure/mongodb/paciente.repository.mongo';
import { MongoDBModule } from 'src/infrastructure/mongodb/mongodb.module';
import { DynamoPacienteRepository } from 'src/infrastructure/dynamodb/paciente.repository.dynamo';
import { DynamoDBModule } from 'src/infrastructure/dynamodb/dynamo.module';
import { CassandraModule } from 'src/infrastructure/cassandra/cassandra.module';
import { CassandraPacienteRepository } from 'src/infrastructure/cassandra/paciente.repository.cassandra';
import { MedicoRepositoryRegistry } from '../medico/medico-repo.registry';
import { FichaMedicaRepositoryRegistry } from '../ficha-medica/ficha-medica.registry';
import { TutorRepositoryRegistry } from '../tutor/tutor-repo.registry';
import { TutorMongoRepository } from 'src/infrastructure/mongodb/tutor.repository.mongo';
import { DynamoTutorRepository } from 'src/infrastructure/dynamodb/tutor.repository.dynamo';
import { CassandraTutorRepository } from 'src/infrastructure/cassandra/tutor.repository.cassandra';
import { PobladorController } from '../poblador.controller';
import { PobladorService } from 'src/application/services/poblador.service';
import { MongoMedicoRepository } from 'src/infrastructure/mongodb/medico.repository.mongo';
import { DynamoMedicoRepository } from 'src/infrastructure/dynamodb/medico.repository.dynamo';
import { CassandraMedicoRepository } from 'src/infrastructure/cassandra/medico.repository.cassandra';
import { MongoFichaMedicaRepository } from 'src/infrastructure/mongodb/ficha-medica.repository.mongo';
import { DynamoFichaMedicaRepository } from 'src/infrastructure/dynamodb/ficha-medica.repository.dynamo';
import { CassandraFichaMedicaRepository } from 'src/infrastructure/cassandra/ficha-medica.repository.cassandra';

@Module({
  imports: [MongoDBModule, DynamoDBModule, CassandraModule],

  controllers: [PobladorController],
  providers: [
    PobladorService,
    PacienteRepositoryRegistry,
    MedicoRepositoryRegistry,
    FichaMedicaRepositoryRegistry,
    TutorRepositoryRegistry,
  ],
  exports: [
    PacienteRepositoryRegistry,
    TutorRepositoryRegistry,
    MedicoRepositoryRegistry,
    FichaMedicaRepositoryRegistry,
  ],
})
export class PobladorModule implements OnModuleInit {
  constructor(
    private readonly pacienteRegistry: PacienteRepositoryRegistry,
    private readonly pacienteMongo: MongoPacienteRepository,
    private readonly pacienteDynamo: DynamoPacienteRepository,
    private readonly pacienteCassandra: CassandraPacienteRepository,

    private readonly tutorRegistry: TutorRepositoryRegistry,
    private readonly tutorMongo: TutorMongoRepository,
    private readonly tutorDynamo: DynamoTutorRepository,
    private readonly tutorCassandra: CassandraTutorRepository,

    private readonly medicoRegistry: MedicoRepositoryRegistry,
    private readonly medicoMongo: MongoMedicoRepository,
    private readonly medicoDynamo: DynamoMedicoRepository,
    private readonly medicoCassandra: CassandraMedicoRepository,

    private readonly fichaRegistry: FichaMedicaRepositoryRegistry,
    private readonly fichaMongo: MongoFichaMedicaRepository,
    private readonly fichaDynamo: DynamoFichaMedicaRepository,
    private readonly fichaCassandra: CassandraFichaMedicaRepository,
  ) {}

  onModuleInit() {
    this.pacienteRegistry.register('mongo', this.pacienteMongo);
    this.pacienteRegistry.register('dynamo', this.pacienteDynamo);
    this.pacienteRegistry.register('cassandra', this.pacienteCassandra);

    this.tutorRegistry.register('mongo', this.tutorMongo);
    this.tutorRegistry.register('dynamo', this.tutorDynamo);
    this.tutorRegistry.register('cassandra', this.tutorCassandra);

    this.medicoRegistry.register('mongo', this.medicoMongo);
    this.medicoRegistry.register('dynamo', this.medicoDynamo);
    this.medicoRegistry.register('cassandra', this.medicoCassandra);

    this.fichaRegistry.register('mongo', this.fichaMongo);
    this.fichaRegistry.register('dynamo', this.fichaDynamo);
    this.fichaRegistry.register('cassandra', this.fichaCassandra);
  }
}
