import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient();
const dynamo = DynamoDBDocumentClient.from(client);

export class UsuarioRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamo = dynamo;
  }

  async createUsuario({ idPaciente, nombre, apellido, rut, organizacionId }) {
    const now = new Date().toISOString();

    const item = {
      PK: `PACIENTE#${idPaciente}`,
      SK: "PROFILE",
      tipo: "Usuario",
      idPaciente,
      nombre,
      apellido,
      rut,
      organizacionId,
      createdAt: now,
      updatedAt: now,
    };

    await this.dynamo.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );

    return item;
  }

  async getUsuario(idPaciente, organizacionId) {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: `PACIENTE#${idPaciente}`,
        SK: "PROFILE",
      },
    });

    const result = await this.dynamo.send(command);
    const item = result.Item;

    // Validar permisos de organización
    if (item && item.organizacionId !== organizacionId) {
      throw new Error("No tienes permiso para acceder a este recurso");
    }

    return item || null;
  }

  async getAllPacientes(organizacionId) {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "begins_with(PK, :pkPrefix) AND SK = :sk AND organizacionId = :orgId",
      ExpressionAttributeValues: {
        ":pkPrefix": "PACIENTE#",
        ":sk": "PROFILE",
        ":orgId": organizacionId,
      },
    });

    const result = await this.dynamo.send(command);

    return result.Items || [];
  }

  async updateUsuario(idPaciente, updates, organizacionId) {
    const usuarioActual = await this.getUsuario(idPaciente, organizacionId);
    if (!usuarioActual) {
      throw new Error(`Usuario ${idPaciente} no encontrado`);
    }

    const now = new Date().toISOString();

    const updateExpr = [];
    const exprAttrValues = { ":u": now };
    const exprAttrNames = {};

    for (const [key, value] of Object.entries(updates)) {
      updateExpr.push(`#${key} = :${key}`);
      exprAttrValues[`:${key}`] = value;
      exprAttrNames[`#${key}`] = key;
    }

    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        PK: `PACIENTE#${idPaciente}`,
        SK: "PROFILE",
      },
      UpdateExpression: `SET ${updateExpr.join(", ")}, updatedAt = :u`,
      ExpressionAttributeNames: exprAttrNames,
      ExpressionAttributeValues: exprAttrValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await this.dynamo.send(command);
    return result.Attributes;
  }


  async deleteUsuario(idPaciente, organizacionId) {
    console.log("deletePaciente -> idPaciente:", idPaciente);
    console.log("deletePaciente -> table:", this.tableName);

    const get = new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: `PACIENTE#${idPaciente}`,
        SK: "PROFILE",
      },
    });

    const found = await this.dynamo.send(get);
    console.log("Paciente encontrado antes de borrar:", found.Item);

    // Validar permisos de organización
    if (found.Item && found.Item.organizacionId !== organizacionId) {
      throw new Error("No tienes permiso para eliminar este recurso");
    }

    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        PK: `PACIENTE#${idPaciente}`,
        SK: "PROFILE",
      },
      ReturnValues: "ALL_OLD",
    });

    const result = await this.dynamo.send(command);
    console.log("deletePaciente result:", result);

    return { idPaciente, deletedItem: result.Attributes || null };
  }



  async getAgendamientosByUsuario(idPaciente) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "AgendamientosPorPaciente",
      KeyConditionExpression: "PacienteId = :pid",
      ExpressionAttributeValues: {
        ":pid": `PACIENTE#${idPaciente}`,
      },
    });

    const result = await this.dynamo.send(command);
    return result.Items || [];
  }

  async createAgendamiento({
    idAgendamiento,
    idPaciente,
    idFuncionario,
    idBox,
    fecha,
    horaEntrada,
    estado = "Pendiente",
  }) {
    const horaSalida = this.addMinutes(horaEntrada, 30);
    const now = new Date().toISOString();

    const item = {
      PK: `AGENDAMIENTO#${idAgendamiento}`,
      SK: "METADATA",
      tipo: "Agendamiento",
      idConsulta: idAgendamiento,
      idPaciente,
      idFuncionario,
      idBox,
      fecha,
      horaEntrada,
      horaSalida,
      PacienteId: `PACIENTE#${idPaciente}`,
      FechaPaciente: `FECHA#${fecha}`,
      FuncionarioId: `FUNCIONARIO#${idFuncionario}`,
      FechaFuncionario: `FECHA#${fecha}`,
      BoxId: `BOX#${idBox}`,
      FechaBox: `FECHA#${fecha}`,
      estado,
      createdAt: now,
      updatedAt: now,
    };

    await this.dynamo.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );

    return item;
  }

  addMinutes(time, mins) {
    const [h, m] = time.split(":").map(Number);
    const date = new Date(2000, 0, 1, h, m);
    date.setMinutes(date.getMinutes() + mins);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
}

export const usuarioRepository = new UsuarioRepository("Agendamiento");

