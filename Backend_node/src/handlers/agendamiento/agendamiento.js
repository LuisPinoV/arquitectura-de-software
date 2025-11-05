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