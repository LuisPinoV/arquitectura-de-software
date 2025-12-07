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

const HORAS = [
  '08:00','08:30','09:00','09:30',
  '10:00','10:30','11:00','11:30',
  '12:00','12:30','13:00','13:30',
  '14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30',
  '18:00','18:30','19:00','19:30',
  '20:00','20:30','21:00','21:30',
  '22:00','22:30','23:00','23:30'
];

export class BoxRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamo = dynamo;
  }

  async createBox({ idBox, especialidad, pasillo, capacidad, disponible = true }) {
    const now = new Date().toISOString();
    const item = {
      PK: `BOX#${idBox}`,
      SK: "METADATA",
      tipo: "Box",
      idBox,
      especialidad,
      pasillo,
      capacidad,
      disponible,
      createdAt: now,
      updatedAt: now,
    };
    await this.dynamo.send(new PutCommand({ TableName: this.tableName, Item: item }));
    return item;
  }

  async getBox(idBox) {
    const result = await this.dynamo.send(new GetCommand({
      TableName: this.tableName,
      Key: { PK: `BOX#${idBox}`, SK: "METADATA" },
    }));
    return result.Item || null;
  }

  async getAllBoxes() {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "#tipo = :t",
      ExpressionAttributeNames: { "#tipo": "tipo" },
      ExpressionAttributeValues: { ":t": "Box" },
    });
    const result = await this.dynamo.send(command);
    return result.Items || [];
  }

  async updateBox(idBox, updates) {
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
      Key: { PK: `BOX#${idBox}`, SK: "METADATA" },
      UpdateExpression: `SET ${updateExpr.join(", ")}, updatedAt = :u`,
      ExpressionAttributeNames: exprAttrNames,
      ExpressionAttributeValues: exprAttrValues,
      ReturnValues: "ALL_NEW",
    });
    const result = await this.dynamo.send(command);
    return result.Attributes;
  }

  async deleteBox(idBox) {
    const found = await this.dynamo.send(new GetCommand({
      TableName: this.tableName,
      Key: { PK: `BOX#${idBox}`, SK: "METADATA" },
    }));
    console.log("Box encontrado antes de borrar:", found.Item);
    const result = await this.dynamo.send(new DeleteCommand({
      TableName: this.tableName,
      Key: { PK: `BOX#${idBox}`, SK: "METADATA" },
      ReturnValues: "ALL_OLD",
    }));
    return { idBox, deletedItem: result.Attributes || null };
  }

  async getAgendamientosByBox(idBox) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "AgendamientosPorBox",
      KeyConditionExpression: "BoxId = :bid",
      ExpressionAttributeValues: { ":bid": `BOX#${idBox}` },
    });
    const result = await this.dynamo.send(command);
    return result.Items || [];
  }

  async getDisponibilidadBox(idBox, fecha) {
    const params = {
      TableName: this.tableName, 
      FilterExpression: "BoxId = :box AND FechaBox = :fecha",
      ExpressionAttributeValues: {
        ":box": `BOX#${idBox}`,
        ":fecha": `FECHA#${fecha}`,
      },
    };

    const result = await this.dynamo.send(new ScanCommand(params)); 

    const agendamientos = result.Items || [];
    const total = agendamientos.length;
    const ocupados = agendamientos.filter(a => a.estado !== "Cancelada").length;
    const disponibles = total - ocupados;

    return { idBox, fecha, total, ocupados, disponibles };
  }

  async getPorcentajeUsoBoxes(fecha, hora) {
    const params = {
      TableName: this.tableName, 
      FilterExpression: "FechaBox = :fecha",
      ExpressionAttributeValues: {
        ":fecha": `FECHA#${fecha}`,
      },
    };

    const result = await this.dynamo.send(new ScanCommand(params)); 

    const agendamientos = (result.Items || []).filter(
      a => a.horaEntrada <= hora && a.horaSalida > hora
    );

    const boxesUsados = new Set(agendamientos.map(a => a.idBox)).size;

    
    const totalBoxes = 120;
    const porcentajeUso = ((boxesUsados / totalBoxes) * 100).toFixed(2);

    return { fecha, hora, boxesUsados, totalBoxes, porcentajeUso };
  }

  async getOcupacionPorEspecialidad(fecha, hora) {
  const params = {
    TableName: this.tableName,
    FilterExpression: "FechaBox = :fecha",
    ExpressionAttributeValues: {
      ":fecha": `FECHA#${fecha}`,
    },
  };

  const result = await this.dynamo.send(new ScanCommand(params));
  console.log("Resultados crudos de DynamoDB:", result.Items?.length || 0);

  const agendamientos = (result.Items || []).filter(
    a => a.horaEntrada <= hora && a.horaSalida > hora
  );
  
  console.log("Agendamientos filtrados:", agendamientos.length);

  const ocupacionPorEspecialidad = {};
  
  for (const ag of agendamientos) {
    try {
      let especialidad = "SIN_ESPECIALIDAD";
      if (ag.idBox) {
        const boxResult = await this.dynamo.send(new GetCommand({
          TableName: this.tableName,
          Key: { 
            PK: `BOX#${ag.idBox}`, 
            SK: "METADATA" 
          }
        }));
        
        if (boxResult.Item) {
          especialidad = boxResult.Item.especialidad || "SIN_ESPECIALIDAD";
          console.log(`Box ${ag.idBox} tiene especialidad: ${especialidad}`);
        } else {
          console.log(`Box ${ag.idBox} no encontrado`);
        }
      } else {
        console.log("Agendamiento sin idBox:", ag);
      }
      if (!ocupacionPorEspecialidad[especialidad]) {
        ocupacionPorEspecialidad[especialidad] = 0;
      }
      ocupacionPorEspecialidad[especialidad]++;
      
    } catch (error) {
      console.error("Error procesando agendamiento:", ag.idConsulta, error);
    }
  }

  console.log("Ocupación resultante:", ocupacionPorEspecialidad);
  return { fecha, hora, ocupacionPorEspecialidad };
}

  async getUsoBox(idBox, fecha, hora) {
    const params = {
      TableName: this.tableName, 
      FilterExpression: "BoxId = :box AND FechaBox = :fecha",
      ExpressionAttributeValues: {
        ":box": `BOX#${idBox}`,
        ":fecha": `FECHA#${fecha}`,
      },
    };

    const result = await this.dynamo.send(new ScanCommand(params)); 

    const agendamiento = (result.Items || []).find(
      a => a.horaEntrada <= hora && a.horaSalida > hora
    );

    return agendamiento
      ? { ocupado: true, agendamiento }
      : { ocupado: false };
  }
}

export const boxRepository = new BoxRepository("Agendamiento");
