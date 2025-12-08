import { AutoRouter } from "itty-router";
import { FuncionarioService } from "../../application/services/funcionario.service.js";

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
    const body = await req.json();
    const nuevo = await funcionarioService.createFuncionario(body);

    return new Response(JSON.stringify(nuevo), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al crear funcionario:', error);
    return new Response(JSON.stringify({ message: 'Error al crear funcionario' }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function getFuncionario(req) {
  const { funcionarioId } = req.params;

  try {
    const funcionario = await funcionarioService.getFuncionario(funcionarioId);

    if (!funcionario) {
      return new Response(JSON.stringify({ message: 'Funcionario no encontrado' }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(funcionario), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al obtener funcionario:', error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function updateFuncionario(req) {
  if (!req.body) {
    return new Response(JSON.stringify({ message: "No hay body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const { funcionarioId } = req.params;
    const updates = await req.json();
    const updated = await funcionarioService.updateFuncionario(funcionarioId, updates);

    return new Response(JSON.stringify(updated), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al actualizar funcionario:', error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function deleteFuncionario(req) {
  try {
    const { funcionarioId } = req.params;
    const eliminado = await funcionarioService.deleteFuncionario(funcionarioId);

    return new Response(JSON.stringify(eliminado), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al eliminar funcionario:', error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function getFuncionarioAgendamientos(req) {
  const { funcionarioId } = req.params;

  try {
    const funcionario = await funcionarioService.getFuncionario(funcionarioId);

    if (!funcionario) {
      return new Response(JSON.stringify({ message: 'Funcionario no encontrado' }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    const agendamientos = await funcionarioService.getFuncionarioAgendamientos(funcionarioId);

    return new Response(JSON.stringify({ funcionario, agendamientos }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('Error al obtener agendamientos del funcionario:', error);
    return new Response(JSON.stringify({ message: 'Error interno del servidor' }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function getAllFuncionariosHandler(req) {
  try {
    const data = await funcionarioService.getAllFuncionarios();
    return new Response(
      JSON.stringify({
        success: true,
        data,
        count: data.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error?.message || "Internal Server Error",
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      {
        status: error?.statusCode || 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
