import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient();
const dynamo = DynamoDBDocumentClient.from(client);

export class AgendamientoRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamo = dynamo;
  }

  async createAgendamiento(agendamientoData) {
    const now = new Date().toISOString();
    const item = {
      PK: `AGENDAMIENTO#${agendamientoData.idConsulta}`,
      SK: "METADATA",
      tipo: "Agendamiento",
      ...agendamientoData,
      createdAt: now,
      updatedAt: now,
    };
    
    await this.dynamo.send(new PutCommand({ 
      TableName: this.tableName, 
      Item: item 
    }));
    return item;
  }

  async getAgendamiento(idConsulta) {
    const result = await this.dynamo.send(new GetCommand({
      TableName: this.tableName,
      Key: { 
        PK: `AGENDAMIENTO#${idConsulta}`, 
        SK: "METADATA" 
      },
    }));
    return result.Item || null;
  }

  async getAllAgendamientos() {
  console.log("Escaneando tabla:", this.tableName);
  const command = new ScanCommand({
    TableName: this.tableName,
    FilterExpression: "#tipo = :t",
    ExpressionAttributeNames: { "#tipo": "tipo" },
    ExpressionAttributeValues: { ":t": "Agendamiento" },
  });
  const result = await this.dynamo.send(command);
  console.log("Items encontrados:", result.Items?.length || 0);
  return result.Items || [];
}


  async updateAgendamiento(idConsulta, updates) {
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
        PK: `AGENDAMIENTO#${idConsulta}`, 
        SK: "METADATA" 
      },
      UpdateExpression: `SET ${updateExpr.join(", ")}, updatedAt = :u`,
      ExpressionAttributeNames: exprAttrNames,
      ExpressionAttributeValues: exprAttrValues,
      ReturnValues: "ALL_NEW",
    });
    const result = await this.dynamo.send(command);
    return result.Attributes;
  }

  async deleteAgendamiento(idConsulta) {
    const found = await this.dynamo.send(new GetCommand({
      TableName: this.tableName,
      Key: { 
        PK: `AGENDAMIENTO#${idConsulta}`, 
        SK: "METADATA" 
      },
    }));
    console.log("Agendamiento borrado:", found.Item);
    
    const result = await this.dynamo.send(new DeleteCommand({
      TableName: this.tableName,
      Key: { 
        PK: `AGENDAMIENTO#${idConsulta}`, 
        SK: "METADATA" 
      },
      ReturnValues: "ALL_OLD",
    }));
    return { idConsulta, deletedItem: result.Attributes || null };
  }

  
  async getAgendamientosByPaciente(idPaciente) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "AgendamientosPorPaciente",
      KeyConditionExpression: "PacienteId = :pid",
      ExpressionAttributeValues: { 
        ":pid": `PACIENTE#${idPaciente}` 
      },
    });
    const result = await this.dynamo.send(command);
    return result.Items || [];
  }

  async getAgendamientosByFuncionario(idFuncionario) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "AgendamientosPorFuncionario", 
      KeyConditionExpression: "FuncionarioId = :fid",
      ExpressionAttributeValues: { 
        ":fid": `FUNCIONARIO#${idFuncionario}` 
      },
    });
    const result = await this.dynamo.send(command);
    return result.Items || [];
  }

  async getAgendamientosByBox(idBox) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "AgendamientosPorBox",
      KeyConditionExpression: "BoxId = :bid",
      ExpressionAttributeValues: { 
        ":bid": `BOX#${idBox}` 
      },
    });
    const result = await this.dynamo.send(command);
    return result.Items || [];
  }

  async getAgendamientosByFecha(fecha) {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "fecha = :fecha",
      ExpressionAttributeValues: { 
        ":fecha": fecha 
      },
    });
    const result = await this.dynamo.send(command);
    return result.Items || [];
  }
  
  async getEstadosAgendamiento(idConsulta) {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": `AGENDAMIENTO#${idConsulta}`,
        ":sk": "ESTADO#"
      },
    });
    const result = await this.dynamo.send(command);
    return result.Items || [];
  }

  async addEstadoAgendamiento(idConsulta, estado) {
    const now = new Date().toISOString();
    const estadoItem = {
      PK: `AGENDAMIENTO#${idConsulta}`,
      SK: `ESTADO#${Date.now()}#${Math.floor(Math.random() * 1000)}`,
      tipo: "EstadoAgendamiento",
      estado: estado,
      fechaEstado: now,
    };
    
    await this.dynamo.send(new PutCommand({ 
      TableName: this.tableName, 
      Item: estadoItem 
    }));
    return estadoItem;
  }
  
  async getResultadoConsulta(idConsulta) {
    const result = await this.dynamo.send(new GetCommand({
      TableName: this.tableName,
      Key: { 
        PK: `AGENDAMIENTO#${idConsulta}`, 
        SK: "RESULTADO" 
      },
    }));
    return result.Item || null;
  }

  async getAgendamientoCompleto(idConsulta) {
  
  const agendamiento = await this.getAgendamiento(idConsulta);
  if (!agendamiento) return null;
  const estados = await this.getEstadosAgendamiento(idConsulta);
  const resultado = await this.getResultadoConsulta(idConsulta);

  return {
    agendamiento,
    estados,
    resultado
  };
}
}

export const agendamientoRepository = new AgendamientoRepository("Agendamiento");