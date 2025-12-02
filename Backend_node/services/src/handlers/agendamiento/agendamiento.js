import { AutoRouter } from "itty-router";
import { AgendamientoService } from "../../application/services/agendamiento.service.js";

// Service
const agendamientoService = new AgendamientoService();

// Routing
const router = AutoRouter();

router
  .post("/agendamiento", createAgendamiento)
  .get("/agendamiento/paciente/:idPaciente", getAgendamientosByPaciente) // ej: /agendamiento/paciente/1
  .get("/agendamiento/funcionario/:idFuncionario", getAgendamientosByFuncionario) // ej: /agendamiento/funcionario/1
  .get("/agendamiento/box/:idBox", getAgendamientosByBox) // ej: /agendamiento/box/1
  .get("/agendamiento/fecha/:fecha", getAgendamientosByFecha) // ej: /agendamiento/fecha/2025-11-04
  .get("/agendamiento/especialidad/:especialidad", getAgendamientosByEspecialidad) // ej: /agendamiento/especialidad/cardiologia TIENE QUE IR SIEMPRE SIN TILDE LA BUSQUEDA JIJI
  .get("/agendamiento/estadisticas/especialidad/conteo", getCountAgendamientosPorEspecialidad) // ej: /agendamiento/estadisticas/especialidad/conteo
  .get("/agendamiento/estadisticas/especialidad/conteo-rango/:fechaInicio/:fechaFin", getCountAgendamientosPorEspecialidadRangoFechas) // ej: /agendamiento/estadisticas/especialidad/conteo-rango/2025-01-01/2025-12-31
  .get("/agendamiento/estadisticas/especialidad/ocupacion/:fechaInicio/:fechaFin", getPorcentajeOcupacionPorEspecialidad) // ej: /agendamiento/estadisticas/especialidad/ocupacion/2024-01-01/2024-12-31
  .get("/agendamiento/box/:idBox/fecha/:fecha", agendamientoTotalHoyBox)// ej: /agendamiento/box/10/fecha/2025-11-01
  .get("/agendamiento/estadisticas/cantidad/:fechaInicio/:fechaFin", cantidadAgendamientosEntreFechas) // ej: /agendamiento/estadisticas/cantidad/2025-11-10/2025-11-11
  .get("/agendamiento/estadisticas/diferencia-ocupacion/:mes1/:mes2", diferenciaOcupanciaMeses) // ej: /agendamiento/estadisticas/diferencia-ocupacion/2025-10/2025-11
  .get("/agendamiento/estadisticas/ocupacion-diaria/:fechaInicio/:fechaFin", ocupacionTotalSegunDiaEntreFechas)// ej: /agendamiento/estadisticas/ocupacion-diaria/2025-11-10/2025-11-11
  .get("/agendamiento/estados/:idConsulta", getEstadosAgendamiento) // ej: /agendamiento/estados/1
  .post("/agendamiento/estado/:idConsulta", addEstadoAgendamiento) // ej: POST /agendamiento/estado/1
  .get("/agendamiento/resultado/:idConsulta", getResultadoConsulta) // ej: /agendamiento/resultado/1
  .get("/agendamiento/:idConsulta", getAgendamiento) // ej: /agendamiento/1
  .get("/agendamiento", getAllAgendamientos)
  .put("/agendamiento/:idConsulta", updateAgendamiento)
  .delete("/agendamiento/:idConsulta", deleteAgendamiento);

router.all("*", () => new Response("Not Found", { status: 404 }));

// Router handler
export const agendamientoHandler = async (event) => {
  const url = `https://${event.headers.host}${event.rawPath}`;
  const method = event.requestContext?.http.method;

  const init = {
  method: method,
  headers: event.headers,
  body: event.body
    ? (event.isBase64Encoded
        ? Buffer.from(event.body, "base64").toString("utf8")
        : event.body)
    : undefined,
};


  try {
    const request = new Request(url, init);
    request.event = event;

    const response = await router.fetch(request);

    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.text(),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};

// Handlers
async function createAgendamiento(req) {
  if (!req.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No hay body" }),
    };
  }

  try {
    const body = await req.json();
    const agendamiento = await agendamientoService.createAgendamiento(body);
    return {
      statusCode: 201,
      body: JSON.stringify(agendamiento),
    };
  } catch (error) {
    console.error("Error al crear agendamiento:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
}

async function getAgendamiento(req) {
  const { idConsulta } = req.params;

  try {
    const agendamiento = await agendamientoService.getAgendamiento(idConsulta);
    if (!agendamiento) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Agendamiento no encontrado" }),
      };
    }
    return { statusCode: 200, body: JSON.stringify(agendamiento) };
  } catch (error) {
    console.error("Error al obtener agendamiento:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
}

async function getAllAgendamientos(_) {
  try {
    const agendamientos = await agendamientoService.getAllAgendamientos();
    return { statusCode: 200, body: JSON.stringify(agendamientos) };
  } catch (error) {
    console.error("Error al obtener agendamientos:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
}

async function updateAgendamiento(req) {
  try {
    const { idConsulta } = req.params;
    const updates = await req.json();
    const updated = await agendamientoService.updateAgendamiento(idConsulta, updates);
    return { statusCode: 200, body: JSON.stringify(updated) };
  } catch (error) {
    console.error("Error al actualizar agendamiento:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
}

async function deleteAgendamiento(req) {
  try {
    const { idConsulta } = req.params;
    const deleted = await agendamientoService.deleteAgendamiento(idConsulta);
    return { statusCode: 200, body: JSON.stringify(deleted) };
  } catch (error) {
    console.error("Error al eliminar agendamiento:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
}

async function getAgendamientosByPaciente(req) {
  const { idPaciente } = req.params;

  if (!idPaciente) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "idPaciente requerido" }),
    };
  }

  try {
    const agendamientos = await agendamientoService.getAgendamientosByPaciente(idPaciente);
    return { statusCode: 200, body: JSON.stringify(agendamientos) };
  } catch (error) {
    console.error("Error al obtener agendamientos por paciente:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}

async function getAgendamientosByFuncionario(req) {
  const { idFuncionario } = req.params;

  if (!idFuncionario) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "idFuncionario requerido" }),
    };
  }

  try {
    const agendamientos = await agendamientoService.getAgendamientosByFuncionario(idFuncionario);
    return { statusCode: 200, body: JSON.stringify(agendamientos) };
  } catch (error) {
    console.error("Error al obtener agendamientos por funcionario:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}

async function getAgendamientosByBox(req) {
  const { idBox } = req.params;

  if (!idBox) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "idBox requerido" }),
    };
  }

  try {
    const agendamientos = await agendamientoService.getAgendamientosByBox(idBox);
    return { statusCode: 200, body: JSON.stringify(agendamientos) };
  } catch (error) {
    console.error("Error al obtener agendamientos por box:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}

async function getAgendamientosByFecha(req) {
  const { fecha } = req.params;

  if (!fecha) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "fecha requerida" }),
    };
  }

  try {
    const agendamientos = await agendamientoService.getAgendamientosByFecha(fecha);
    return { statusCode: 200, body: JSON.stringify(agendamientos) };
  } catch (error) {
    console.error("Error al obtener agendamientos por fecha:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}


async function getAgendamientosByEspecialidad(req) {
  const { especialidad } = req.params;

  if (!especialidad) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "especialidad requerida" }),
    };
  }

  try {
    const agendamientos = await agendamientoService.getAgendamientosByEspecialidad(especialidad);
    return { 
      statusCode: 200, 
      body: JSON.stringify(agendamientos) 
    };
  } catch (error) {
    console.error("Error al obtener agendamientos por especialidad:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno del servidor" }),
    };
  }
}

async function getCountAgendamientosPorEspecialidad(_) {
  try {
    const conteo = await agendamientoService.getCountAgendamientosPorEspecialidad();
    return { 
      statusCode: 200, 
      body: JSON.stringify(conteo) 
    };
  } catch (error) {
    console.error("Error al obtener conteo por especialidad:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Error interno del servidor",
        details: error.message 
      }),
    };
  }
}

async function getCountAgendamientosPorEspecialidadRangoFechas(req) {
  try {
    const { fechaInicio, fechaFin } = req.params;
    
    console.log("Parámetros recibidos:", { fechaInicio, fechaFin });
    
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: "Formato de fecha inválido. Use YYYY-MM-DD" 
        }),
      };
    }

    const resultado = await agendamientoService.getCountAgendamientosPorEspecialidadRangoFechas(fechaInicio, fechaFin);
    return { 
      statusCode: 200, 
      body: JSON.stringify(resultado) 
    };
  } catch (error) {
    console.error("Error al obtener conteo por especialidad en rango:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Error interno del servidor",
        details: error.message 
      }),
    };
  }
}

async function getPorcentajeOcupacionPorEspecialidad(req) {
  try {
    const { fechaInicio, fechaFin } = req.params;
    
    console.log("Parámetros recibidos:", { fechaInicio, fechaFin });
    
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: "Formato de fecha inválido. Use YYYY-MM-DD" 
        }),
      };
    }

    const resultado = await agendamientoService.getPorcentajeOcupacionPorEspecialidad(fechaInicio, fechaFin);
    return { 
      statusCode: 200, 
      body: JSON.stringify(resultado) 
    };
  } catch (error) {
    console.error("Error al obtener porcentaje de ocupación:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Error interno del servidor",
        details: error.message 
      }),
    };
  }
}

async function getAgendamientoCompleto(req) {
  const { idConsulta } = req.params;

  if (!idConsulta) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "idConsulta requerido" }),
    };
  }

  try {
    const agendamientoCompleto = await agendamientoService.getAgendamientoCompleto(idConsulta);
    if (!agendamientoCompleto) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Agendamiento no encontrado" }),
      };
    }
    return { statusCode: 200, body: JSON.stringify(agendamientoCompleto) };
  } catch (error) {
    console.error("Error al obtener agendamiento completo:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}

async function getEstadosAgendamiento(req) {
  const { idConsulta } = req.params;

  if (!idConsulta) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "idConsulta requerido" }),
    };
  }

  try {
    const estados = await agendamientoService.getEstadosAgendamiento(idConsulta);
    return { statusCode: 200, body: JSON.stringify(estados) };
  } catch (error) {
    console.error("Error al obtener estados del agendamiento:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}

async function addEstadoAgendamiento(req) {
  const { idConsulta } = req.params;

  if (!req.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No hay body" }),
    };
  }

  if (!idConsulta) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "idConsulta requerido" }),
    };
  }

  try {
    const body = await req.json();
    const { estado } = body;
    
    if (!estado) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "estado requerido" }),
      };
    }

    const nuevoEstado = await agendamientoService.addEstadoAgendamiento(idConsulta, estado);
    return {
      statusCode: 201,
      body: JSON.stringify(nuevoEstado),
    };
  } catch (error) {
    console.error("Error al agregar estado al agendamiento:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
}

async function getResultadoConsulta(req) {
  const { idConsulta } = req.params;

  if (!idConsulta) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "idConsulta requerido" }),
    };
  }

  try {
    const resultado = await agendamientoService.getResultadoConsulta(idConsulta);
    return { statusCode: 200, body: JSON.stringify(resultado) };
  } catch (error) {
    console.error("Error al obtener resultado de consulta:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}

async function agendamientoTotalHoyBox(req) {
  const { idBox, fecha } = req.params;

  if (!idBox || !fecha) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "idBox y fecha requeridos" }),
    };
  }
  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!fechaRegex.test(fecha)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Formato de fecha inválido. Use YYYY-MM-DD" }),
    };
  }

  try {
    const agendamientos = await agendamientoService.agendamientoTotalHoyBox(idBox, fecha);
    return { 
      statusCode: 200, 
      body: JSON.stringify(agendamientos) 
    };
  } catch (error) {
    console.error("Error al obtener agendamientos por box y fecha:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}

async function cantidadAgendamientosEntreFechas(req) {
  const { fechaInicio, fechaFin } = req.params;

  if (!fechaInicio || !fechaFin) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "fechaInicio y fechaFin requeridos" }),
    };
  }

  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Formato de fecha inválido. Use YYYY-MM-DD" }),
    };
  }

  try {
    const cantidad = await agendamientoService.cantidadAgendamientosEntreFechas(fechaInicio, fechaFin);
    return { 
      statusCode: 200, 
      body: JSON.stringify({ 
        fechaInicio, 
        fechaFin, 
        cantidad 
      }) 
    };
  } catch (error) {
    console.error("Error al obtener cantidad de agendamientos entre fechas:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }

}
async function diferenciaOcupanciaMeses(req) {
  const { mes1, mes2 } = req.params;

  if (!mes1 || !mes2) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "mes1 y mes2 requeridos (formato: YYYY-MM)" }),
    };
  }


  const mesRegex = /^\d{4}-\d{2}$/;
  if (!mesRegex.test(mes1) || !mesRegex.test(mes2)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Formato de mes inválido. Use YYYY-MM" }),
    };
  }

  try {
    const resultado = await agendamientoService.diferenciaOcupanciaMeses(mes1, mes2);
    return { 
      statusCode: 200, 
      body: JSON.stringify(resultado) 
    };
  } catch (error) {
    console.error("Error al calcular diferencia de ocupación:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}

async function ocupacionTotalSegunDiaEntreFechas(req) {
  const { fechaInicio, fechaFin } = req.params;

  if (!fechaInicio || !fechaFin) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "fechaInicio y fechaFin requeridos" }),
    };
  }

  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Formato de fecha inválido. Use YYYY-MM-DD" }),
    };
  }

  try {
    const resultado = await agendamientoService.ocupacionTotalSegunDiaEntreFechas(fechaInicio, fechaFin);
    return { 
      statusCode: 200, 
      body: JSON.stringify(resultado) 
    };
  } catch (error) {
    console.error("Error al obtener ocupación por día:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}