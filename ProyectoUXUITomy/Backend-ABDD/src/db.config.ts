import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { connection } from 'mongoose';
//import * as cassandra from 'cassandra-driver';
import {
  DynamoDBClient,
  CreateTableCommand,
  CreateTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { AwsCredentialIdentity } from '@aws-sdk/types';
import { Client as CassandraClient } from 'cassandra-driver';

export async function CreateMongoConnection(
  config: ConfigService,
): Promise<MongooseModuleOptions> {
  const uri = config.get<string>('MONGO_URI');

  if (!uri) {
    console.error('MONGO_URI not defined on .env');
    throw new Error('No environment variable MONGO_URI for mongo connection');
  }

  console.log('Connecting to Mongo...');

  connection.on('connected', () => {
    console.log('Connected succesfully to MongoDB');
  });

  connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  connection.on('disconnected', () =>
    console.warn('Disconnected from the mongo database'),
  );

  return {
    uri,
    connectionFactory: (connection) => {
      return connection;
    },
  };
}

export const createDynamoClient = async (
  config: ConfigService,
): Promise<DynamoDBDocumentClient> => {
  const region = config.get<string>('DYNAMO_REGION');
  const accessKeyId = config.get<string>('DYNAMO_ACCESS_KEY_ID');
  const secretAccessKey = config.get<string>('DYNAMO_SECRET_ACCESS_KEY');
  const sessionToken = config.get<string>('DYNAMO_SESSION_TOKEN');

  const credentials: AwsCredentialIdentity = {
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
    sessionToken: sessionToken,
  };

  const client = new DynamoDBClient({
    region,
    credentials: credentials,
  });

  //Paciente
  let paramsPaciente: CreateTableCommandInput = {
    TableName: 'Paciente',
    AttributeDefinitions: [{ AttributeName: 'idPaciente', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'idPaciente', KeyType: 'HASH' }],
    BillingMode: 'PAY_PER_REQUEST',
  };

  try {
    await client.send(new CreateTableCommand(paramsPaciente));
    console.log(`Paciente created successfully.`);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log(`Paciente already exists.`);
    } else {
      throw err;
    }
  }

  //Tutor
  const paramsTutor: CreateTableCommandInput = {
    TableName: 'Tutor',
    AttributeDefinitions: [{ AttributeName: 'idTutor', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'idTutor', KeyType: 'HASH' }],
    BillingMode: 'PAY_PER_REQUEST',
  };

  try {
    await client.send(new CreateTableCommand(paramsTutor));
    console.log(`Tutor created successfully.`);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log(`Tutor already exists.`);
    } else {
      throw err;
    }
  }

  //Medico
  const paramsMedico: CreateTableCommandInput = {
    TableName: 'Medico',
    AttributeDefinitions: [{ AttributeName: 'idMedico', AttributeType: 'S' }],
    KeySchema: [{ AttributeName: 'idMedico', KeyType: 'HASH' }],
    BillingMode: 'PAY_PER_REQUEST',
  };

  try {
    await client.send(new CreateTableCommand(paramsMedico));
    console.log(`Medico created successfully.`);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log(`Medico already exists.`);
    } else {
      throw err;
    }
  }

  //FichaMedica
  const paramsFicha: CreateTableCommandInput = {
    TableName: 'FichaMedica',
    AttributeDefinitions: [
      { AttributeName: 'idFichaMedica', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: 'idMascota', AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'idFichaMedica', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'idMascota-index',
        KeySchema: [{ AttributeName: 'idMascota', KeyType: 'HASH' }],
        Projection: {
          ProjectionType: 'ALL',
        },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  };

  try {
    await client.send(new CreateTableCommand(paramsFicha));
    console.log(`FichaMedica created successfully.`);
  } catch (err) {
    if (err.name === 'ResourceInUseException') {
      console.log(`FichaMedica already exists.`);
    } else {
      throw err;
    }
  }

  return DynamoDBDocumentClient.from(client);
};

export const createCassandraCliente = async (
  config: ConfigService,
): Promise<CassandraClient> => {
  const contactPointConfig = config.get<string>('CASSANDRA_CONTACT_POINTS');
  const localDCConfig = config.get<string>('CASSANDRA_LOCAL_DC');
  //const keyspaceConfig = config.get<string>('CASSANDRA_KEYSPACE');
  const keyspaceConfig = undefined;

  const settings = {
    contactPoints: [contactPointConfig!],
    localDataCenter: localDCConfig!,
    keyspace: keyspaceConfig!,
  };

  let client = new CassandraClient(settings);

  const keyspaceConfigKeySpace = config.get<string>('CASSANDRA_KEYSPACE');

  const settingsKeyspace = {
    contactPoints: [contactPointConfig!],
    localDataCenter: localDCConfig!,
    keyspace: keyspaceConfigKeySpace!,
  };

  let query = `
    CREATE KEYSPACE IF NOT EXISTS ${keyspaceConfigKeySpace}
    WITH replication = {
      'class': 'SimpleStrategy',
      'replication_factor': 1
    };
  `;

  await client.execute(query);

  client = new CassandraClient(settingsKeyspace);

  //Paciente
  query = `
    CREATE TABLE IF NOT EXISTS Paciente (
    id UUID PRIMARY KEY,
    edad int,
    especie text,
    genero text,
    idtutor text,
    nombre text,
    raza text
    );
  `;

  await client.execute(query);

  //Tutor
  query = `
    CREATE TABLE IF NOT EXISTS Tutor (
    id UUID PRIMARY KEY,
    nombre text,
    idmascotas List<text>,
    );
  `;

  await client.execute(query);

  //Medico
  query = `
    CREATE TABLE IF NOT EXISTS Medico (
    id UUID PRIMARY KEY,
    especialidad text,
    estado text,
    nombre text
    );
  `;

  await client.execute(query);

  //FichaMedica
  query = `
    CREATE TABLE IF NOT EXISTS FichaMedica (
    idfichamedica UUID ,
    idmascota text,
    PRIMARY KEY(idfichamedica, idmascota)
    );
  `;

  await client.execute(query);

  //RevisionMedica
  query = `
    CREATE TABLE IF NOT EXISTS RevisionMedica (
    idrevision TEXT,
    idficha uuid,
    idmedico uuid,
    costo int,
    fechahora timestamp,
    pagado boolean,
    peso float,
    presion float,
    temperatura float,
    PRIMARY KEY(idrevision, idficha, idmedica)
    );
  `;

  await client.execute(query);

  //Procedimiento
  query = `
    CREATE TABLE IF NOT EXISTS Procedimiento (
    idprocedimiento text,
    idrevision text,
    costo int,
    descripcion text,
    idmedicos list<text>,
    PRIMARY KEY(idprocedimiento, idrevision)
    );
  `;

  await client.execute(query);

  //Medicamento
  query = `
    CREATE TABLE IF NOT EXISTS Medicamento (
    idprocedimiento text,
    nombre text,
    cantidad int,
    PRIMARY KEY(idprocedimiento, nombre)
    );
  `;

  await client.execute(query);

  //Carnet Vacuna
  query = `
    CREATE TABLE IF NOT EXISTS CarnetVacuna (
    idfichamedica uuid,
    idcarnet text,
    enfermedad text,
    PRIMARY KEY(idfichamedica, idcarnet)
    );
  `;

  await client.execute(query);

  //Vacuna
  query = `
    CREATE TABLE IF NOT EXISTS Vacuna (
    idcarnet text PRIMARY KEY,
    fecha timestamp,
    nombrevacuna text
    );
  `;

  await client.execute(query);

  return client;
};
