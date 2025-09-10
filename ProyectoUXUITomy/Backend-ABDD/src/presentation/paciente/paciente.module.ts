import { Module, OnModuleInit } from "@nestjs/common";
import { PacienteController } from "src/presentation/paciente.controller";
import { PacienteService } from "src/application/services/paciente.service";
import { PacienteRepositoryRegistry } from "./paciente-repo.registry";
import { MongoPacienteRepository } from "src/infrastructure/mongodb/paciente.repository.mongo";

import { MongoDBModule } from "src/infrastructure/mongodb/mongodb.module";
import { DynamoPacienteRepository } from "src/infrastructure/dynamodb/paciente.repository.dynamo";
import { DynamoDBModule } from "src/infrastructure/dynamodb/dynamo.module";
import { CassandraModule } from "src/infrastructure/cassandra/cassandra.module";
import { CassandraPacienteRepository } from "src/infrastructure/cassandra/paciente.repository.cassandra";

@Module({
    imports:[MongoDBModule, DynamoDBModule, CassandraModule],
    
    controllers:[PacienteController],
    providers: [
        PacienteService,
        PacienteRepositoryRegistry,
    ],
    exports:[PacienteRepositoryRegistry]
})
export class PacienteModule implements OnModuleInit
{
    constructor (
        private readonly registry: PacienteRepositoryRegistry,
        private readonly mongo : MongoPacienteRepository,
        private readonly dynamo : DynamoPacienteRepository,
        private readonly cassandra : CassandraPacienteRepository
    ){}

    onModuleInit() {
        this.registry.register('mongo', this.mongo);
        this.registry.register('dynamo', this.dynamo);
        this.registry.register('cassandra', this.cassandra);
    }
}