import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { createCassandraCliente, createDynamoClient, CreateMongoConnection } from './db.config';
import { MongooseModule } from "@nestjs/mongoose";

@Module(
    {
        imports:[
            ConfigModule.forRoot({ isGlobal:true }),

            MongooseModule.forRootAsync({
                imports:[ConfigModule],
                useFactory: CreateMongoConnection,
                inject: [ConfigService] 
            })
        ],
        providers:
        [
            {
                provide:'DYNAMO_CLIENT',
                useFactory:createDynamoClient,
                inject: [ConfigService]
            },
            {
                provide:'CASSANDRA_CLIENT',
                useFactory:createCassandraCliente,
                inject: [ConfigService]
            },
        ],
        exports: [
            MongooseModule,
            ConfigModule,
            'DYNAMO_CLIENT',
            'CASSANDRA_CLIENT'
        ]
    }
)
export class DBConfigModule{}