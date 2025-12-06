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
      conteoPorEspecialidad[especialidad] = agendamientos.length;
    }
    
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
    

    const capacidadPorEspecialidad = {};
    const boxesPorEspecialidad = {};
    
    boxesResult.Items?.forEach(box => {
      const especialidad = box.especialidad;
      if (!especialidad) return;
      
      if (!capacidadPorEspecialidad[especialidad]) {
        capacidadPorEspecialidad[especialidad] = 0;
        boxesPorEspecialidad[especialidad] = 0;
      }
      
      capacidadPorEspecialidad[especialidad] += box.capacidad || 1;
      boxesPorEspecialidad[especialidad]++;
    });
    
    const porcentajeOcupacion = {};
    
    Object.entries(conteoResultado.conteo).forEach(([especialidad, count]) => {
      const capacidad = capacidadPorEspecialidad[especialidad] || 1;
      

      const diasRango = this.calcularDiasEntreFechas(fechaInicio, fechaFin);
      

      const capacidadTotal = capacidad * diasRango;
      
      const porcentaje = capacidadTotal > 0 ? (count / capacidadTotal) * 100 : 0;
      
      porcentajeOcupacion[especialidad] = {
        agendamientos: count,
        capacidadDiaria: capacidad,
        capacidadTotalPeriodo: capacidadTotal,
        porcentajeOcupacion: Math.round(porcentaje * 100) / 100,
        boxes: boxesPorEspecialidad[especialidad] || 0
      };
    });
    
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

calcularDiasEntreFechas(fechaInicio, fechaFin) {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diferenciaTiempo = fin.getTime() - inicio.getTime();
  const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24)) + 1;
  return Math.max(diferenciaDias, 1);
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

async agendamientoTotalHoyBox(idBox, fecha) {
    try {
      console.log(`Buscando agendamientos para box ${idBox} en fecha ${fecha}`);
      
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "#idBox = :idbox AND #fecha = :fecha AND #tipo = :tipo",
        ExpressionAttributeNames: { 
          "#idBox": "idBox",
          "#fecha": "fecha",
          "#tipo": "tipo"
        },
        ExpressionAttributeValues: { 
          ":idbox": Number(idBox), 
          ":fecha": fecha,
          ":tipo": "Agendamiento"
        }
      });

      const result = await this.dynamo.send(command);
      console.log(`Encontrados ${result.Items?.length || 0} agendamientos para box ${idBox} en fecha ${fecha}`);
      
      return result.Items || [];
      
    } catch (error) {
      console.error("Error en agendamientoTotalHoyBox:", error);
      throw error;
    }
  }
  async cantidadAgendamientosEntreFechas(fechaInicio, fechaFin) {
    try {
      console.log(`Contando agendamientos entre ${fechaInicio} y ${fechaFin}`);
      
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "#fecha BETWEEN :f1 AND :f2 AND #tipo = :tipo",
        ExpressionAttributeNames: { 
          "#fecha": "fecha",
          "#tipo": "tipo"
        },
        ExpressionAttributeValues: { 
          ":f1": fechaInicio, 
          ":f2": fechaFin,
          ":tipo": "Agendamiento"
        },
        Select: "COUNT"
      });

      const result = await this.dynamo.send(command);
      console.log(`Total de agendamientos entre ${fechaInicio} y ${fechaFin}: ${result.Count}`);
      
      return result.Count || 0;
      
    } catch (error) {
      console.error("Error en cantidadAgendamientosEntreFechas:", error);
      throw error;
    }
  }

  async diferenciaOcupanciaMeses(mes1, mes2) {
    try {
      console.log(`Calculando diferencia de ocupación entre ${mes1} y ${mes2}`);
      
      const meses30 = ["04", "06", "09", "11"];

      const calcularRangoMes = (mes) => {
        const [year, mm] = mes.split("-");
        let dias = 31;
        if (mm === "02") dias = 28;
        else if (meses30.includes(mm)) dias = 30;

        const min = `${year}-${mm}-01`;
        const max = `${year}-${mm}-${dias.toString().padStart(2, "0")}`;
        return { min, max, dias };
      };

      const { min: mes1Min, max: mes1Max, dias: dias1 } = calcularRangoMes(mes1);
      const { min: mes2Min, max: mes2Max, dias: dias2 } = calcularRangoMes(mes2);


      const boxesResult = await this.dynamo.send(new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "#tipo = :tipoBox",
        ExpressionAttributeNames: { "#tipo": "tipo" },
        ExpressionAttributeValues: { ":tipoBox": "Box" },
      }));
      const totalBoxes = boxesResult.Items?.length || 0;

      if (totalBoxes === 0) {
        throw new Error("No se encontraron boxes en la base de datos");
      }


      const agendamientosMes1 = await this.dynamo.send(new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "#fecha BETWEEN :min AND :max AND #tipo = :tipoAgendamiento",
        ExpressionAttributeNames: { 
          "#fecha": "fecha",
          "#tipo": "tipo"
        },
        ExpressionAttributeValues: { 
          ":min": mes1Min, 
          ":max": mes1Max,
          ":tipoAgendamiento": "Agendamiento"
        },
        Select: "COUNT",
      }));

      const agendamientosMes2 = await this.dynamo.send(new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "#fecha BETWEEN :min AND :max AND #tipo = :tipoAgendamiento",
        ExpressionAttributeNames: { 
          "#fecha": "fecha",
          "#tipo": "tipo"
        },
        ExpressionAttributeValues: { 
          ":min": mes2Min, 
          ":max": mes2Max,
          ":tipoAgendamiento": "Agendamiento"
        },
        Select: "COUNT",
      }));

      const countMes1 = agendamientosMes1.Count || 0;
      const countMes2 = agendamientosMes2.Count || 0;


      const capacidadTotalMes1 = 930 * dias1 * totalBoxes;
      const capacidadTotalMes2 = 930 * dias2 * totalBoxes;

      const minutosOcupadosMes1 = countMes1 * 30;
      const minutosOcupadosMes2 = countMes2 * 30;

      const porcentajeMes1 = capacidadTotalMes1 > 0 ? (minutosOcupadosMes1 / capacidadTotalMes1) * 100 : 0;
      const porcentajeMes2 = capacidadTotalMes2 > 0 ? (minutosOcupadosMes2 / capacidadTotalMes2) * 100 : 0;
      
      const diferencia = porcentajeMes2 - porcentajeMes1;

      console.log(`Resultado diferencia ocupación: ${diferencia.toFixed(2)}%`);

      return {
        mes1: {
          agendamientos: countMes1,
          dias: dias1,
          capacidadTotalMinutos: capacidadTotalMes1,
          minutosOcupados: minutosOcupadosMes1,
          porcentajeOcupacion: Math.round(porcentajeMes1 * 100) / 100
        },
        mes2: {
          agendamientos: countMes2,
          dias: dias2,
          capacidadTotalMinutos: capacidadTotalMes2,
          minutosOcupados: minutosOcupadosMes2,
          porcentajeOcupacion: Math.round(porcentajeMes2 * 100) / 100
        },
        diferencia: Math.round(diferencia * 100) / 100,
        totalBoxes
      };
      
    } catch (error) {
      console.error("Error en diferenciaOcupanciaMeses:", error);
      throw error;
    }
  }

  /**
   * Calcula la ocupación total por día entre un rango de fechas
   * @param {string} fechaInicio
   * @param {string} fechaFin
   * @returns {Promise<Object>}
   */
  async ocupacionTotalSegunDiaEntreFechas(fechaInicio, fechaFin) {
    try {
      console.log(`Calculando ocupación por día entre ${fechaInicio} y ${fechaFin}`);
      
      const generarFechas = (fecha1, fecha2) => {
        const fechas = [];
        let current = new Date(fecha1);
        const end = new Date(fecha2);
        while (current <= end) {
          fechas.push(current.toISOString().split('T')[0]);
          current.setDate(current.getDate() + 1);
        }
        return fechas;
      };

      const boxesResult = await this.dynamo.send(new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "#tipo = :tipoBox",
        ExpressionAttributeNames: { "#tipo": "tipo" },
        ExpressionAttributeValues: { ":tipoBox": "Box" },
      }));
      const totalBoxes = boxesResult.Items?.length || 0;

      if (totalBoxes === 0) {
        throw new Error("No se encontraron boxes en la base de datos");
      }

      const fechas = generarFechas(fechaInicio, fechaFin);
      const ocupacionPorDia = {};
      fechas.forEach(f => {
        ocupacionPorDia[f] = {
          minutosOcupados: 0,
          agendamientos: 0,
          porcentajeOcupacion: 0
        };
      });

      const agendamientosResult = await this.dynamo.send(new ScanCommand({
        TableName: this.tableName,
        FilterExpression: "#fecha BETWEEN :f1 AND :f2 AND #tipo = :tipoAgendamiento",
        ExpressionAttributeNames: { 
          "#fecha": "fecha",
          "#tipo": "tipo"
        },
        ExpressionAttributeValues: { 
          ":f1": fechaInicio, 
          ":f2": fechaFin,
          ":tipoAgendamiento": "Agendamiento"
        },
        ProjectionExpression: "fecha, horaEntrada, horaSalida, idBox"
      }));

      console.log(`Encontrados ${agendamientosResult.Items?.length || 0} agendamientos en el rango`);

      agendamientosResult.Items?.forEach(item => {
        const fecha = item.fecha;
        if (ocupacionPorDia[fecha]) {
          const [hEntrada, mEntrada] = item.horaEntrada.split(":").map(Number);
          const [hSalida, mSalida] = item.horaSalida.split(":").map(Number);
          const minutos = (hSalida - hEntrada) * 60 + (mSalida - mEntrada);
          
          ocupacionPorDia[fecha].minutosOcupados += minutos;
          ocupacionPorDia[fecha].agendamientos += 1;
        }
      });

      fechas.forEach(fecha => {
        const capacidadTotalDia = 930 * totalBoxes;
        const minutosOcupados = ocupacionPorDia[fecha].minutosOcupados;
        
        ocupacionPorDia[fecha].porcentajeOcupacion = capacidadTotalDia > 0 
          ? Math.round((minutosOcupados / capacidadTotalDia) * 100 * 100) / 100 
          : 0;
        

        ocupacionPorDia[fecha].capacidadTotalMinutos = capacidadTotalDia;
        ocupacionPorDia[fecha].totalBoxes = totalBoxes;
      });

      const diasConDatos = fechas.filter(f => ocupacionPorDia[f].agendamientos > 0);
      const promedioOcupacion = diasConDatos.length > 0 
        ? diasConDatos.reduce((sum, fecha) => sum + ocupacionPorDia[fecha].porcentajeOcupacion, 0) / diasConDatos.length
        : 0;

      console.log(`Ocupación promedio: ${promedioOcupacion.toFixed(2)}%`);

      return {
        fechaInicio,
        fechaFin,
        totalDias: fechas.length,
        totalBoxes,
        ocupacionPorDia,
        resumen: {
          promedioOcupacion: Math.round(promedioOcupacion * 100) / 100,
          totalAgendamientos: agendamientosResult.Items?.length || 0,
          diasConAgendamientos: diasConDatos.length
        }
      };
      
    } catch (error) {
      console.error("Error en ocupacionTotalSegunDiaEntreFechas:", error);
      throw error;
    }
  }
}

export const agendamientoRepository = new AgendamientoRepository("Agendamiento");