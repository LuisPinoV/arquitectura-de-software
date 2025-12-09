import { AutoRouter } from "itty-router";
import { AgendamientoService } from "../../application/services/agendamiento.service.js";
import { extractCognitoUserId } from "../../middleware/auth.middleware.js";

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
    return new Response(JSON.stringify({ error: err.message }));
  };
};

// Handlers
async function createAgendamiento(req) {
  if (!req.body) {
    return new Response(JSON.stringify({ message: "No hay body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const body = await req.json();
    const agendamiento = await agendamientoService.createAgendamiento(body, organizacionId);
    return new Response(JSON.stringify(agendamiento), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al crear agendamiento:", error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getAgendamiento(req) {
  const { idConsulta } = req.params;

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const agendamiento = await agendamientoService.getAgendamiento(idConsulta, organizacionId);
    if (!agendamiento) {
      return new Response(JSON.stringify({ message: "Agendamiento no encontrado" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify(agendamiento), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener agendamiento:", error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getAllAgendamientos(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const agendamientos = await agendamientoService.getAllAgendamientos(organizacionId);
    return new Response(JSON.stringify(agendamientos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener agendamientos:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function updateAgendamiento(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { idConsulta } = req.params;
    const updates = await req.json();
    const updated = await agendamientoService.updateAgendamiento(idConsulta, updates, organizacionId);
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al actualizar agendamiento:", error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function deleteAgendamiento(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { idConsulta } = req.params;
    const deleted = await agendamientoService.deleteAgendamiento(idConsulta, organizacionId);
    return new Response(JSON.stringify(deleted), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al eliminar agendamiento:", error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getAgendamientosByPaciente(req) {
  const { idPaciente } = req.params;

  if (!idPaciente) {
    return new Response(JSON.stringify({ error: "idPaciente requerido" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const agendamientos = await agendamientoService.getAgendamientosByPaciente(idPaciente, organizacionId);
    return new Response(JSON.stringify(agendamientos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener agendamientos por paciente:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({ error: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getAgendamientosByFuncionario(req) {
  const { idFuncionario } = req.params;

  if (!idFuncionario) {
    return new Response(JSON.stringify({ error: "idFuncionario requerido" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const agendamientos = await agendamientoService.getAgendamientosByFuncionario(idFuncionario, organizacionId);
    return new Response(JSON.stringify(agendamientos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener agendamientos por funcionario:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({ error: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getAgendamientosByBox(req) {
  const { idBox } = req.params;

  if (!idBox) {
    return new Response(JSON.stringify({ error: "idBox requerido" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const agendamientos = await agendamientoService.getAgendamientosByBox(idBox, organizacionId);
    return new Response(JSON.stringify(agendamientos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener agendamientos por box:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({ error: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getAgendamientosByFecha(req) {
  const { fecha } = req.params;

  if (!fecha) {
    return new Response(JSON.stringify({ error: "fecha requerida" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const agendamientos = await agendamientoService.getAgendamientosByFecha(fecha, organizacionId);
    return new Response(JSON.stringify(agendamientos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener agendamientos por fecha:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({ error: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}


async function getAgendamientosByEspecialidad(req) {
  const { especialidad } = req.params;

  if (!especialidad) {
    return new Response(JSON.stringify({ error: "especialidad requerida" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const agendamientos = await agendamientoService.getAgendamientosByEspecialidad(especialidad, organizacionId);
    return new Response(JSON.stringify(agendamientos), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al obtener agendamientos por especialidad:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({ error: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getCountAgendamientosPorEspecialidad(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const conteo = await agendamientoService.getCountAgendamientosPorEspecialidad(organizacionId);
    return new Response(JSON.stringify(conteo), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al obtener conteo por especialidad:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({
      error: error.message
    }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getCountAgendamientosPorEspecialidadRangoFechas(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { fechaInicio, fechaFin } = req.params;

    console.log("Parámetros recibidos:", { fechaInicio, fechaFin });

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
      return new Response(JSON.stringify({
        error: "Formato de fecha inválido. Use YYYY-MM-DD"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const resultado = await agendamientoService.getCountAgendamientosPorEspecialidadRangoFechas(fechaInicio, fechaFin, organizacionId);
    return new Response(JSON.stringify(resultado), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al obtener conteo por especialidad en rango:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({
      error: error.message
    }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getPorcentajeOcupacionPorEspecialidad(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { fechaInicio, fechaFin } = req.params;

    console.log("Parámetros recibidos:", { fechaInicio, fechaFin });

    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
      return new Response(JSON.stringify({
        error: "Formato de fecha inválido. Use YYYY-MM-DD"
      }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const resultado = await agendamientoService.getPorcentajeOcupacionPorEspecialidad(fechaInicio, fechaFin, organizacionId);
    return new Response(JSON.stringify(resultado), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al obtener porcentaje de ocupación:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({
      error: error.message
    }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getAgendamientoCompleto(req) {
  const { idConsulta } = req.params;

  if (!idConsulta) {
    return new Response(JSON.stringify({ error: "idConsulta requerido" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const agendamientoCompleto = await agendamientoService.getAgendamientoCompleto(idConsulta);
    if (!agendamientoCompleto) {
      return new Response(JSON.stringify({ message: "Agendamiento no encontrado" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }
    return new Response(JSON.stringify(agendamientoCompleto), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener agendamiento completo:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function getEstadosAgendamiento(req) {
  const { idConsulta } = req.params;

  if (!idConsulta) {
    return new Response(JSON.stringify({ error: "idConsulta requerido" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const estados = await agendamientoService.getEstadosAgendamiento(idConsulta);
    return new Response(JSON.stringify(estados), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener estados del agendamiento:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function addEstadoAgendamiento(req) {
  const { idConsulta } = req.params;

  if (!req.body) {
    return new Response(JSON.stringify({ message: "No hay body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  if (!idConsulta) {
    return new Response(JSON.stringify({ error: "idConsulta requerido" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const body = await req.json();
    const { estado } = body;

    if (!estado) {
      return new Response(JSON.stringify({ error: "estado requerido" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const nuevoEstado = await agendamientoService.addEstadoAgendamiento(idConsulta, estado);
    return new Response(JSON.stringify(nuevoEstado), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al agregar estado al agendamiento:", error);
    return new Response(JSON.stringify({ message: "Error interno" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function getResultadoConsulta(req) {
  const { idConsulta } = req.params;

  if (!idConsulta) {
    return new Response(JSON.stringify({ error: "idConsulta requerido" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const resultado = await agendamientoService.getResultadoConsulta(idConsulta);
    return new Response(JSON.stringify(resultado), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener resultado de consulta:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function agendamientoTotalHoyBox(req) {
  const { idBox, fecha } = req.params;

  if (!idBox || !fecha) {
    return new Response(JSON.stringify({ error: "idBox y fecha requeridos" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!fechaRegex.test(fecha)) {
    return new Response(JSON.stringify({ error: "Formato de fecha inválido. Use YYYY-MM-DD" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const agendamientos = await agendamientoService.agendamientoTotalHoyBox(idBox, fecha, organizacionId);
    return new Response(JSON.stringify(agendamientos), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al obtener agendamientos por box y fecha:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function cantidadAgendamientosEntreFechas(req) {
  const { fechaInicio, fechaFin } = req.params;

  if (!fechaInicio || !fechaFin) {
    return new Response(JSON.stringify({ error: "fechaInicio y fechaFin requeridos" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
    return new Response(JSON.stringify({ error: "Formato de fecha inválido. Use YYYY-MM-DD" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const cantidad = await agendamientoService.cantidadAgendamientosEntreFechas(fechaInicio, fechaFin);
    return new Response(JSON.stringify({
      fechaInicio,
      fechaFin,
      cantidad
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al obtener cantidad de agendamientos entre fechas:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
async function diferenciaOcupanciaMeses(req) {
  const { mes1, mes2 } = req.params;

  if (!mes1 || !mes2) {
    return new Response(JSON.stringify({ error: "mes1 y mes2 requeridos (formato: YYYY-MM)" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }


  const mesRegex = /^\d{4}-\d{2}$/;
  if (!mesRegex.test(mes1) || !mesRegex.test(mes2)) {
    return new Response(JSON.stringify({ error: "Formato de mes inválido. Use YYYY-MM" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const resultado = await agendamientoService.diferenciaOcupanciaMeses(mes1, mes2);
    return new Response(JSON.stringify(resultado), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al calcular diferencia de ocupación:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function ocupacionTotalSegunDiaEntreFechas(req) {
  const { fechaInicio, fechaFin } = req.params;

  if (!fechaInicio || !fechaFin) {
    return new Response(JSON.stringify({ error: "fechaInicio y fechaFin requeridos" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!fechaRegex.test(fechaInicio) || !fechaRegex.test(fechaFin)) {
    return new Response(JSON.stringify({ error: "Formato de fecha inválido. Use YYYY-MM-DD" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const resultado = await agendamientoService.ocupacionTotalSegunDiaEntreFechas(fechaInicio, fechaFin, organizacionId);
    return new Response(JSON.stringify(resultado), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al obtener ocupación por día:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}