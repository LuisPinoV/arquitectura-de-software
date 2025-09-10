import { Module, OnModuleInit } from "@nestjs/common";
import { TutorService } from "src/application/services/tutor.service";
import { TutorMongoRepository } from "src/infrastructure/mongodb/tutor.repository.mongo";
import { TutorRepositoryRegistry } from "./tutor-repo.registry";
import { DynamoTutorRepository } from "src/infrastructure/dynamodb/tutor.repository.dynamo";

import { MongoDBModule } from "src/infrastructure/mongodb/mongodb.module";
import { TutorController } from "../tutor.controller";
import { DynamoDBModule } from "src/infrastructure/dynamodb/dynamo.module";
import { CassandraModule } from "src/infrastructure/cassandra/cassandra.module";
import { CassandraTutorRepository } from "src/infrastructure/cassandra/tutor.repository.cassandra";

@Module({
    imports:[MongoDBModule, DynamoDBModule, CassandraModule],
    
    controllers:[TutorController],
    providers: [
        TutorService,
        TutorRepositoryRegistry,
    ],
    exports:[TutorRepositoryRegistry]
})
export class TutorModule implements OnModuleInit
{
    constructor (
        private readonly registry: TutorRepositoryRegistry,
        private readonly mongo : TutorMongoRepository,
        private readonly dynamo : DynamoTutorRepository,
        private readonly cassandra : CassandraTutorRepository
    ){}

    onModuleInit() {
        this.registry.register('mongo', this.mongo);
        this.registry.register('dynamo', this.dynamo);
        this.registry.register('cassandra', this.cassandra);
    }
}