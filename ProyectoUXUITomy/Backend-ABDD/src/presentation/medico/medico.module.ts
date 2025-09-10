import { Module, OnModuleInit } from "@nestjs/common";
import { MedicoController } from "../medico.controller";
import { MedicoService } from "src/application/services/medico.service";
import { MedicoRepositoryRegistry } from "./medico-repo.registry";
import { MongoMedicoRepository } from "src/infrastructure/mongodb/medico.repository.mongo";

import { MongoDBModule } from "src/infrastructure/mongodb/mongodb.module";
import { DynamoDBModule } from "src/infrastructure/dynamodb/dynamo.module";
import { DynamoMedicoRepository } from "src/infrastructure/dynamodb/medico.repository.dynamo";
import { CassandraModule } from "src/infrastructure/cassandra/cassandra.module";
import { CassandraMedicoRepository } from "src/infrastructure/cassandra/medico.repository.cassandra";

@Module({
    imports:[MongoDBModule, DynamoDBModule, CassandraModule],
    
    controllers:[MedicoController],
    providers: [
        MedicoService,
        MedicoRepositoryRegistry,
    ],
    exports:[MedicoRepositoryRegistry]
})
export class MedicoModule implements OnModuleInit
{
    constructor (
        private readonly registry: MedicoRepositoryRegistry,
        private readonly mongo : MongoMedicoRepository,
        private readonly dynamo : DynamoMedicoRepository,
        private readonly cassandra : CassandraMedicoRepository
    ){}

    onModuleInit() {
        this.registry.register('mongo', this.mongo);
        this.registry.register('dynamo', this.dynamo);
        this.registry.register('cassandra', this.cassandra);
    }
}