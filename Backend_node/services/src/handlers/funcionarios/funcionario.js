import { AutoRouter } from "itty-router";
import { FuncionarioService } from "../../application/services/funcionario.service.js";
import { extractCognitoUserId } from "../../middleware/auth.middleware.js";

const funcionarioService = new FuncionarioService();

// Routing
const router = AutoRouter();

router
  .post("/funcionario", createFuncionario)
  .get("/funcionario", getAllFuncionariosHandler)
  .get("/funcionario/agendamientos/:funcionarioId", getFuncionarioAgendamientos)
  .get("/funcionario/:funcionarioId", getFuncionario)
  .put("/funcionario/:funcionarioId", updateFuncionario)
  .delete("/funcionario/:funcionarioId", deleteFuncionario);

router.all("*", () => new Response("Not Found", { status: 404 }));

// Router handler
export const funcionarioHandler = async (event) => {
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
async function createFuncionario(req) {
  if (!req.body) {
    return new Response(JSON.stringify({ message: "No hay body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const body = await req.json();
    const nuevo = await funcionarioService.createFuncionario(body, organizacionId);

    return new Response(JSON.stringify(nuevo), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al crear funcionario:', error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getFuncionario(req) {
  const { funcionarioId } = req.params;

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const funcionario = await funcionarioService.getFuncionario(funcionarioId, organizacionId);

    if (!funcionario) {
      return new Response(JSON.stringify({ message: 'Funcionario no encontrado' }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(funcionario), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al obtener funcionario:', error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function updateFuncionario(req) {
  if (!req.body) {
    return new Response(JSON.stringify({ message: "No hay body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { funcionarioId } = req.params;
    const updates = await req.json();
    const updated = await funcionarioService.updateFuncionario(funcionarioId, updates, organizacionId);

    return new Response(JSON.stringify(updated), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al actualizar funcionario:', error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function deleteFuncionario(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { funcionarioId } = req.params;
    const eliminado = await funcionarioService.deleteFuncionario(funcionarioId, organizacionId);

    return new Response(JSON.stringify(eliminado), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al eliminar funcionario:', error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getFuncionarioAgendamientos(req) {
  const { funcionarioId } = req.params;

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const funcionario = await funcionarioService.getFuncionario(funcionarioId, organizacionId);

    if (!funcionario) {
      return new Response(JSON.stringify({ message: 'Funcionario no encontrado' }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    const agendamientos = await funcionarioService.getFuncionarioAgendamientos(funcionarioId);

    return new Response(JSON.stringify({ funcionario, agendamientos }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al obtener agendamientos del funcionario:', error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getAllFuncionariosHandler(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const data = await funcionarioService.getAllFuncionarios(organizacionId);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}
