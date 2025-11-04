import { AutoRouter } from "itty-router";
import { usuarioRepository } from '../../infrastructure/db/usuario.repository.js';
import { UsuarioService } from "../../application/services/usuario.service.js";

//Service
const usuarioService = new UsuarioService(usuarioRepository);

// Routing
const router = AutoRouter();

router
  .post("/usuario", createUsuario)
  .get("/usuario/:usuarioId", getUsuario)
  .put("/usuario/:usuarioId", updateUsuario)
  .delete("/usuario/:usuarioId", deleteUsuario)
  .get("/usuario/agendamientos/:usuarioId", getUsuarioAgendamientos)
  .post("/usuario/agendamiento", createAgendamiento);

router.all("*", () => new Response("Not Found", { status: 404 }));

// Router handler
export const usuarioHandler = async (event) => {
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
async function createUsuario(req) {
  if (!req.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No hay body" }),
    };
  }

  try {
    const body = await req.json();
    const nuevoPaciente = await usuarioService.createUsuario(body);
    return {
      statusCode: 201,
      body: JSON.stringify(nuevoPaciente),
    };
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al crear usuario' }),
    };
  }
}

async function getUsuario(req) {
  const { usuarioId } = req.params;

  try {
    const usuario = await usuarioService.getUsuario(usuarioId);
    if (!usuario) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Usuario no encontrado' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(usuario),
    };
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al obtener usuario' }),
    };
  }
}

async function getUsuarioAgendamientos(req) {
  const { usuarioId } = req.params;

  try {
    const usuario = await usuarioService.getUsuario(usuarioId);
    if (!usuario) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Usuario no encontrado' }),
      };
    }

    const agendamientos = await usuarioService.getUsuarioAgendamientos(usuarioId);

    return {
      statusCode: 200,
      body: JSON.stringify({ usuario: usuario, agendamientos }),
    };
  } catch (error) {
    console.error('Error al obtener usuario con agendamientos:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' }),
    };
  }
}

async function updateUsuario(req) {
  if (!req.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No hay body" }),
    };
  }

  try {
    const { usuarioId } = req.params;
    const updates = await req.json();
    const actualizado = await usuarioService.updateUsuario(usuarioId, updates);

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

async function deleteUsuario(req) {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Falta el parámetro pacienteId en la ruta" }),
      };
    }

    const eliminado = await usuarioService.deleteUsuario(usuarioId);

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
    const nuevo = await usuarioService.createAgendamiento(body);

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