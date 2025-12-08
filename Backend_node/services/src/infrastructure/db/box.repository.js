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
  '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30',
  '22:00', '22:30', '23:00', '23:30'
];

export class BoxRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.dynamo = dynamo;
  }

  async createBox({ idBox, especialidad, pasillo, capacidad, nombre, disponible = true, organizacionId, duracionBloqueMinutos, horaApertura, horaCierre }) {
    const now = new Date().toISOString();
    const item = {
      PK: `BOX#${idBox}`,
      SK: "METADATA",
      tipo: "Box",
      idBox,
      nombre,
      especialidad,
      pasillo,
      capacidad,
      disponible,
      organizacionId,
      duracionBloqueMinutos: Number(duracionBloqueMinutos) || 30,
      horaApertura: horaApertura || '08:00',
      horaCierre: horaCierre || '20:00',
      inventario: {},
      createdAt: now,
      updatedAt: now,
    };
    await this.dynamo.send(new PutCommand({ TableName: this.tableName, Item: item }));
    return item;
  }

  async getBox(idBox, organizacionId) {
    const result = await this.dynamo.send(new GetCommand({
      TableName: this.tableName,
      Key: { PK: `BOX#${idBox}`, SK: "METADATA" },
    }));

    const item = result.Item;

    // Validar permisos de organización
    if (item && item.organizacionId !== organizacionId) {
      throw new Error("No tienes permiso para acceder a este recurso");
    }

    return item || null;
  }

  async getAllBoxes(organizacionId) {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "#tipo = :t AND organizacionId = :orgId",
      ExpressionAttributeNames: { "#tipo": "tipo" },
      ExpressionAttributeValues: {
        ":t": "Box",
        ":orgId": organizacionId
      },
    });
    const result = await this.dynamo.send(command);
    return result.Items || [];
  }

  async updateBox(idBox, updates, organizacionId) {
    const boxActual = await this.getBox(idBox, organizacionId);
    if (!boxActual) {
      throw new Error(`Box ${idBox} no encontrado`);
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
      Key: { PK: `BOX#${idBox}`, SK: "METADATA" },
      UpdateExpression: `SET ${updateExpr.join(", ")}, updatedAt = :u`,
      ExpressionAttributeNames: exprAttrNames,
      ExpressionAttributeValues: exprAttrValues,
      ReturnValues: "ALL_NEW",
    });
    const result = await this.dynamo.send(command);
    return result.Attributes;
  }

  async deleteBox(idBox, organizacionId) {
    const found = await this.dynamo.send(new GetCommand({
      TableName: this.tableName,
      Key: { PK: `BOX#${idBox}`, SK: "METADATA" },
    }));
    console.log("Box encontrado antes de borrar:", found.Item);

    // Validar permisos de organización
    if (found.Item && found.Item.organizacionId !== organizacionId) {
      throw new Error("No tienes permiso para eliminar este recurso");
    }

    const result = await this.dynamo.send(new DeleteCommand({
      TableName: this.tableName,
      Key: { PK: `BOX#${idBox}`, SK: "METADATA" },
      ReturnValues: "ALL_OLD",
    }));
    return { idBox, deletedItem: result.Attributes || null };
  }

  async getInventario(idBox, organizacionId) {
    const box = await this.getBox(idBox, organizacionId);
    if (!box) return null;
    return box.inventario || {};
  }

  async updateInventario(idBox, inventario, organizacionId) {
    const box = await this.getBox(idBox, organizacionId);
    if (!box) throw new Error("Box no encontrado o sin permisos");

    const now = new Date().toISOString();
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { PK: `BOX#${idBox}`, SK: "METADATA" },
      UpdateExpression: "SET inventario = :inv, updatedAt = :u",
      ExpressionAttributeValues: {
        ":inv": inventario,
        ":u": now,
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await this.dynamo.send(command);
    return result.Attributes?.inventario;
  }

  async deleteInventario(idBox, organizacionId) {
    const box = await this.getBox(idBox, organizacionId);
    if (!box) throw new Error("Box no encontrado o sin permisos");

    const now = new Date().toISOString();
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { PK: `BOX#${idBox}`, SK: "METADATA" },
      UpdateExpression: "SET inventario = :inv, updatedAt = :u",
      ExpressionAttributeValues: {
        ":inv": {},
        ":u": now,
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await this.dynamo.send(command);
    return result.Attributes?.inventario;
  }

  async getAllInventarios(organizacionId) {
    const boxes = await this.getAllBoxes(organizacionId);
    return boxes.map(box => ({
      idBox: box.idBox,
      nombre: box.nombre,
      inventario: box.inventario || {}
    }));
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

  async getDisponibilidadBox(idBox, fecha, organizacionId) {
    const box = await this.getBox(idBox, organizacionId);
    if (!box) {
      throw new Error(`Box ${idBox} no encontrado`);
    }

    const { duracionBloqueMinutos = 30, horaApertura = '08:00', horaCierre = '20:00' } = box;

    console.log(`[getDisponibilidadBox] Buscando agendamientos para Box ${idBox} y fecha ${fecha}`);

    const params = {
      TableName: this.tableName,
      IndexName: "AgendamientosPorBox",
      KeyConditionExpression: "BoxId = :box AND FechaBox = :fecha",
      ExpressionAttributeValues: {
        ":box": `BOX#${idBox}`,
        ":fecha": `FECHA#${fecha}`,
      },
    };

    const result = await this.dynamo.send(new QueryCommand(params));
    const agendamientos = result.Items || [];
    console.log(`[getDisponibilidadBox] Encontrados ${agendamientos.length} agendamientos`);
    if (agendamientos.length > 0) {
      console.log(`[getDisponibilidadBox] Ejemplo:`, JSON.stringify(agendamientos[0]));
      console.log(`[getDisponibilidadBox] Horas ocupadas:`, agendamientos.map(a => `${a.horaEntrada}-${a.horaSalida}`));
    }

    const bloques = [];
    let horaActual = horaApertura;

    while (horaActual < horaCierre) {
      const horaFinBloque = this.addMinutes(horaActual, duracionBloqueMinutos);


      if (horaFinBloque > horaCierre) break;

      const ocupado = agendamientos.some(a =>
        a.estado !== "Cancelada" && a.horaEntrada === horaActual
      );

      bloques.push({
        hora: horaActual,
        disponible: !ocupado
      });

      horaActual = horaFinBloque;
    }

    const total = bloques.length;
    const ocupados = bloques.filter(b => !b.disponible).length;
    const disponibles = total - ocupados;

    return {
      idBox,
      fecha,
      total,
      ocupados,
      disponibles,
      bloques,
      configuracion: { duracionBloqueMinutos, horaApertura, horaCierre }
    };
  }

  addMinutes(time, mins) {
    const [h, m] = time.split(":").map(Number);
    const date = new Date(2000, 0, 1, h, m);
    date.setMinutes(date.getMinutes() + mins);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
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
