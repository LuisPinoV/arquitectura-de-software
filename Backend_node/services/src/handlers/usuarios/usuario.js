import { AutoRouter } from "itty-router";
import { usuarioRepository } from '../../infrastructure/db/usuario.repository.js';
import { UsuarioService } from "../../application/services/usuario.service.js";
import { extractCognitoUserId } from "../../middleware/auth.middleware.js";

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
  .post("/agendamiento", createAgendamiento);

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Internal Server Error", error: err.message }),
    };
  }
};

// Handlers
async function createUsuario(req) {
  if (!req.body) {
    return new Response(JSON.stringify({ message: "No hay body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const body = await req.json();
    const nuevoPaciente = await usuarioService.createUsuario(body, organizacionId);
    return new Response(JSON.stringify(nuevoPaciente), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getUsuario(req) {
  const { usuarioId } = req.params;

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const usuario = await usuarioService.getUsuario(usuarioId, organizacionId);
    if (!usuario) {
      return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(usuario), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getUsuarioAgendamientos(req) {
  const { usuarioId } = req.params;

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const usuario = await usuarioService.getUsuario(usuarioId, organizacionId);
    if (!usuario) {
      return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    const agendamientos = await usuarioService.getUsuarioAgendamientos(usuarioId);

    return new Response(JSON.stringify({ usuario: usuario, agendamientos }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al obtener usuario con agendamientos:', error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function updateUsuario(req) {
  if (!req.body) {
    return new Response(JSON.stringify({ message: "No hay body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { usuarioId } = req.params;
    const updates = await req.json();
    const actualizado = await usuarioService.updateUsuario(usuarioId, updates, organizacionId);

    return new Response(JSON.stringify(actualizado), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function deleteUsuario(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return new Response(JSON.stringify({ message: "Falta el parámetro pacienteId en la ruta" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const eliminado = await usuarioService.deleteUsuario(usuarioId, organizacionId);

    return new Response(JSON.stringify(eliminado), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function createAgendamiento(req) {
  if (!req.body) {
    return new Response(JSON.stringify({ message: "No hay body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const body = await req.json();
    const nuevo = await usuarioService.createAgendamiento(body);

    return new Response(JSON.stringify(nuevo), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al crear agendamiento:', error);
    return new Response(JSON.stringify({ message: 'Error al crear agendamiento' }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}