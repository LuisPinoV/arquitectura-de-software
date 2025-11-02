import { AutoRouter } from "itty-router";
import { pacienteRepository } from '../../infrastructure/db/paciente.repository.js';

// Routing
const router = AutoRouter();

router
  .post("/paciente", createPaciente)
  .get("/paciente/:pacienteId", getPaciente)
  .put("/paciente/:pacienteId", updatePaciente)
  .delete("/paciente/:pacienteId", deletePaciente)
  .get("/paciente/agendamientos/:pacienteId", getPacienteAgendamientos)
  .post("/agendamiento", createAgendamiento);

router.all("*", () => new Response("Not Found", { status: 404 }));

// Router handler
export const pacienteHandler = async (event) => {
  const url = `https://${event.headers.host}${event.rawPath}`;
  const method = event.requestContext?.http.method;

  const init = {
    method: method,
    headers: event.headers,
    body: event.body
      ? Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8")
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
async function createPaciente(req) {
  if (!req.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No hay body" }),
    };
  }

  try {
    const body = await req.json();
    const nuevoPaciente = await pacienteRepository.createPaciente(body);
    return {
      statusCode: 201,
      body: JSON.stringify(nuevoPaciente),
    };
  } catch (error) {
    console.error('Error al crear paciente:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al crear paciente' }),
    };
  }
}

async function getPaciente(req) {
  const { pacienteId } = req.params;

  try {
    const paciente = await pacienteRepository.getPaciente(pacienteId);
    if (!paciente) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Paciente no encontrado' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(paciente),
    };
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al obtener paciente' }),
    };
  }
}

async function getPacienteAgendamientos(req) {
  const { pacienteId } = req.params;

  try {
    const paciente = await pacienteRepository.getPaciente(pacienteId);
    if (!paciente) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Paciente no encontrado' }),
      };
    }

    const agendamientos = await pacienteRepository.getAgendamientosByPaciente(pacienteId);

    return {
      statusCode: 200,
      body: JSON.stringify({ paciente, agendamientos }),
    };
  } catch (error) {
    console.error('Error al obtener paciente con agendamientos:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
}

async function updatePaciente(req) {
  if (!req.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No hay body" }),
    };
  }

  try {
    const { pacienteId } = req.params;
    const updates = await req.json();
    const actualizado = await pacienteRepository.updatePaciente(pacienteId, updates);

    return {
      statusCode: 200,
      body: JSON.stringify(actualizado),
    };
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al actualizar paciente' }),
    };
  }
}

async function deletePaciente(req) {
  try {
    const { pacienteId } = req.params;

    if (!pacienteId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Falta el parámetro pacienteId en la ruta" }),
      };
    }

    const eliminado = await pacienteRepository.deletePaciente(pacienteId);

    return {
      statusCode: 200,
      body: JSON.stringify(eliminado),
    };
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error al eliminar paciente" }),
    };
  }
}

async function createAgendamiento(req) {
  if (!req.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No hay body" }),
    };
  }

  try {
    const body = await req.json();
    const nuevo = await pacienteRepository.createAgendamiento(body);

    return {
      statusCode: 201,
      body: JSON.stringify(nuevo),
    };
  } catch (error) {
    console.error('Error al crear agendamiento:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al crear agendamiento' }),
    };
  }
}