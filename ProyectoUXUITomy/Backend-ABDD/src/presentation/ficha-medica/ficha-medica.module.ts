import { Module, OnModuleInit } from "@nestjs/common";
import { MongoDBModule } from "src/infrastructure/mongodb/mongodb.module";
import { FichaMedicaController } from "../ficha-medica.controller";
import { FichaMedicaService } from "src/application/services/ficha-medica.service";
import { FichaMedicaRepositoryRegistry } from "./ficha-medica.registry";
import { MongoFichaMedicaRepository } from "src/infrastructure/mongodb/ficha-medica.repository.mongo";
import { DynamoDBModule } from "src/infrastructure/dynamodb/dynamo.module";
import { DynamoFichaMedicaRepository } from "src/infrastructure/dynamodb/ficha-medica.repository.dynamo";
import { CassandraModule } from "src/infrastructure/cassandra/cassandra.module";
import { CassandraFichaMedicaRepository } from "src/infrastructure/cassandra/ficha-medica.repository.cassandra";

@Module({
    imports:[MongoDBModule, DynamoDBModule, CassandraModule],
    
    controllers:[FichaMedicaController],
    providers: [
        FichaMedicaService,
        FichaMedicaRepositoryRegistry,
    ],
    exports:[FichaMedicaRepositoryRegistry]
})
export class FichaMedicaModule implements OnModuleInit
{
    constructor (
        private readonly registry: FichaMedicaRepositoryRegistry,
        private readonly mongo : MongoFichaMedicaRepository,
        private readonly dynamo : DynamoFichaMedicaRepository,
        private readonly cassandra : CassandraFichaMedicaRepository
    ){}

    onModuleInit() {
        this.registry.register('mongo', this.mongo);
        this.registry.register('dynamo', this.dynamo);
        this.registry.register('cassandra', this.cassandra);
    }
}