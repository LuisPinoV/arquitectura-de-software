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


  async getAgendamientosByEspecialidad(especialidadNombre) {
  try {
    const especialidadNormalizada = this.normalizarEspecialidad(especialidadNombre);
    const boxesCommand = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "#tipo = :tipoBox",
      ExpressionAttributeNames: { 
        "#tipo": "tipo" 
      },
      ExpressionAttributeValues: { 
        ":tipoBox": "Box"
      },
    });
    
    const boxesResult = await this.dynamo.send(boxesCommand);
    const boxesFiltrados = boxesResult.Items?.filter(box => 
      this.normalizarEspecialidad(box.especialidad) === especialidadNormalizada
    ) || [];
    const boxIds = boxesFiltrados.map(box => box.idBox);
    
    if (boxIds.length === 0) {
      console.log(`No se encontraron boxes para especialidad: ${especialidadNombre}`);
      return [];
    }
    
    const agendamientosPromises = boxIds.map(boxId => 
      this.getAgendamientosByBox(boxId)
    );
    
    const agendamientosPorBox = await Promise.all(agendamientosPromises);
    const todosAgendamientos = agendamientosPorBox.flat();
    
    return todosAgendamientos;
    
  } catch (error) {
    console.error("Error en getAgendamientosByEspecialidad:", error);
    throw error;
  }
}
normalizarEspecialidad(especialidad) {
  if (!especialidad) return '';
  
  return especialidad
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, "");
}

async getCountAgendamientosPorEspecialidad() {
  try {
    console.log("Obteniendo conteo de agendamientos por especialidad...");
    
    // Obtener todas las especialidades únicas
    const boxesCommand = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "#tipo = :tipoBox",
      ExpressionAttributeNames: { "#tipo": "tipo" },
      ExpressionAttributeValues: { ":tipoBox": "Box" },
    });
    
    const boxesResult = await this.dynamo.send(boxesCommand);
    const especialidadesUnicas = [...new Set(boxesResult.Items?.map(box => box.especialidad).filter(Boolean))];
    
    console.log(`Especialidades encontradas: ${especialidadesUnicas.length}`);
    
    // Contar agendamientos por cada especialidad
    const conteoPorEspecialidad = {};
    
    for (const especialidad of especialidadesUnicas) {
      const agendamientos = await this.getAgendamientosByEspecialidad(especialidad);
      conteoPorEspecialidad[especialidad] = agendamientos.length;
    }
    
    // Ordenar por cantidad descendente
    const resultadoOrdenado = Object.entries(conteoPorEspecialidad)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [especialidad, count]) => {
        acc[especialidad] = count;
        return acc;
      }, {});
    
    console.log("Conteo por especialidad:", resultadoOrdenado);
    
    return resultadoOrdenado;
    
  } catch (error) {
    console.error("Error en getCountAgendamientosPorEspecialidad:", error);
    throw error;
  }
}

async getCountAgendamientosPorEspecialidadRangoFechas(fechaInicio, fechaFin) {
  try {
    console.log(`Obteniendo conteo por especialidad entre ${fechaInicio} y ${fechaFin}`);
    
    if (!fechaInicio || !fechaFin) {
      throw new Error("fechaInicio y fechaFin son requeridos");
    }
    const boxesCommand = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "#tipo = :tipoBox",
      ExpressionAttributeNames: { "#tipo": "tipo" },
      ExpressionAttributeValues: { ":tipoBox": "Box" },
    });
    
    const boxesResult = await this.dynamo.send(boxesCommand);
    const especialidadesUnicas = [...new Set(boxesResult.Items?.map(box => box.especialidad).filter(Boolean))];
    
    console.log(`Especialidades encontradas: ${especialidadesUnicas.length}`);
    
    const conteoPorEspecialidad = {};
    
    for (const especialidad of especialidadesUnicas) {
      const agendamientos = await this.getAgendamientosByEspecialidad(especialidad);
      
      const agendamientosFiltrados = agendamientos.filter(ag => {
        const fechaAgendamiento = ag.fecha;
        return fechaAgendamiento >= fechaInicio && fechaAgendamiento <= fechaFin;
      });
      
      conteoPorEspecialidad[especialidad] = agendamientosFiltrados.length;
    }
    const resultadoOrdenado = Object.entries(conteoPorEspecialidad)
      .sort(([, a], [, b]) => b - a)
      .reduce((acc, [especialidad, count]) => {
        acc[especialidad] = count;
        return acc;
      }, {});
    
    console.log("Conteo por especialidad en rango de fechas:", resultadoOrdenado);
    
    return {
      fechaInicio,
      fechaFin,
      conteo: resultadoOrdenado,
      total: Object.values(conteoPorEspecialidad).reduce((sum, count) => sum + count, 0)
    };
    
  } catch (error) {
    console.error("Error en getCountAgendamientosPorEspecialidadRangoFechas:", error);
    throw error;
  }
}

async getPorcentajeOcupacionPorEspecialidad(fechaInicio, fechaFin) {
  try {
    console.log(`Calculando porcentaje de ocupación por especialidad entre ${fechaInicio} y ${fechaFin}`);
    
    
    const conteoResultado = await this.getCountAgendamientosPorEspecialidadRangoFechas(fechaInicio, fechaFin);
    
    const boxesCommand = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "#tipo = :tipoBox",
      ExpressionAttributeNames: { "#tipo": "tipo" },
      ExpressionAttributeValues: { ":tipoBox": "Box" },
    });
    
    const boxesResult = await this.dynamo.send(boxesCommand);
    
    // Calcular capacidad máxima por especialidad
    const capacidadPorEspecialidad = {};
    const boxesPorEspecialidad = {};
    
    boxesResult.Items?.forEach(box => {
      const especialidad = box.especialidad;
      if (!especialidad) return;
      
      if (!capacidadPorEspecialidad[especialidad]) {
        capacidadPorEspecialidad[especialidad] = 0;
        boxesPorEspecialidad[especialidad] = 0;
      }
      
      // Sumar capacidad del box (asumiendo que capacidad es el número máximo de pacientes por día)
      capacidadPorEspecialidad[especialidad] += box.capacidad || 1;
      boxesPorEspecialidad[especialidad]++;
    });
    
    // Calcular porcentaje de ocupación
    const porcentajeOcupacion = {};
    
    Object.entries(conteoResultado.conteo).forEach(([especialidad, count]) => {
      const capacidad = capacidadPorEspecialidad[especialidad] || 1;
      
      // Calcular días en el rango
      const diasRango = this.calcularDiasEntreFechas(fechaInicio, fechaFin);
      
      // Capacidad total en el período = capacidad por día * número de días
      const capacidadTotal = capacidad * diasRango;
      
      // Porcentaje de ocupación
      const porcentaje = capacidadTotal > 0 ? (count / capacidadTotal) * 100 : 0;
      
      porcentajeOcupacion[especialidad] = {
        agendamientos: count,
        capacidadDiaria: capacidad,
        capacidadTotalPeriodo: capacidadTotal,
        porcentajeOcupacion: Math.round(porcentaje * 100) / 100, // Redondear a 2 decimales
        boxes: boxesPorEspecialidad[especialidad] || 0
      };
    });
    
    // Ordenar por porcentaje de ocupación descendente
    const resultadoOrdenado = Object.entries(porcentajeOcupacion)
      .sort(([, a], [, b]) => b.porcentajeOcupacion - a.porcentajeOcupacion)
      .reduce((acc, [especialidad, datos]) => {
        acc[especialidad] = datos;
        return acc;
      }, {});
    
    console.log("Porcentaje de ocupación por especialidad:", resultadoOrdenado);
    
    return {
      fechaInicio,
      fechaFin,
      diasPeriodo: this.calcularDiasEntreFechas(fechaInicio, fechaFin),
      ocupacion: resultadoOrdenado
    };
    
  } catch (error) {
    console.error("Error en getPorcentajeOcupacionPorEspecialidad:", error);
    throw error;
  }
}

// Función auxiliar para calcular días entre fechas
calcularDiasEntreFechas(fechaInicio, fechaFin) {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diferenciaTiempo = fin.getTime() - inicio.getTime();
  const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24)) + 1; // +1 para incluir ambos extremos
  return Math.max(diferenciaDias, 1); // Mínimo 1 día
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