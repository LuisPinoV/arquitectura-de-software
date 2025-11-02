import { AutoRouter } from "itty-router";
import { funcionarioRepository } from '../../infrastructure/db/funcionario.repository.js';

// Routing
const router = AutoRouter();

router
  .post("/funcionario", createFuncionario)
  .get("/funcionario/:funcionarioId", getFuncionario)
  .put("/funcionario/:funcionarioId", updateFuncionario)
  .delete("/funcionario/:funcionarioId", deleteFuncionario)
  .get("/funcionario/agendamientos/:funcionarioId", getFuncionarioAgendamientos);

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
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No hay body" }),
    };
  }

  try {
    const body = await req.json();
    const nuevo = await funcionarioRepository.createFuncionario(body);

    return {
      statusCode: 201,
      body: JSON.stringify(nuevo),
    };
  } catch (error) {
    console.error('Error al crear funcionario:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al crear funcionario' }),
    };
  }
}

async function getFuncionario(req) {
  const { funcionarioId } = req.params;

  try {
    const funcionario = await funcionarioRepository.getFuncionario(funcionarioId);

    if (!funcionario) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ message: 'Funcionario no encontrado' }) 
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(funcionario),
    };
  } catch (error) {
    console.error('Error al obtener funcionario:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: 'Error interno del servidor' }) 
    };
  }
}

async function updateFuncionario(req) {
  if (!req.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No hay body" }),
    };
  }

  try {
    const { funcionarioId } = req.params;
    const updates = await req.json();
    const updated = await funcionarioRepository.updateFuncionario(funcionarioId, updates);

    return {
      statusCode: 200,
      body: JSON.stringify(updated),
    };
  } catch (error) {
    console.error('Error al actualizar funcionario:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: 'Error interno del servidor' }) 
    };
  }
}

async function deleteFuncionario(req) {
  try {
    const { funcionarioId } = req.params;
    const eliminado = await funcionarioRepository.deleteFuncionario(funcionarioId);

    return {
      statusCode: 200,
      body: JSON.stringify(eliminado),
    };
  } catch (error) {
    console.error('Error al eliminar funcionario:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: 'Error interno del servidor' }) 
    };
  }
}

async function getFuncionarioAgendamientos(req) {
  const { funcionarioId } = req.params;

  try {
    const funcionario = await funcionarioRepository.getFuncionario(funcionarioId);

    if (!funcionario) {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ message: 'Funcionario no encontrado' }) 
      };
    }

    const agendamientos = await funcionarioRepository.getAgendamientosByFuncionario(funcionarioId);

    return {
      statusCode: 200,
      body: JSON.stringify({ funcionario, agendamientos }),
    };
  } catch (error) {
    console.error('Error al obtener agendamientos del funcionario:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: 'Error interno del servidor' }) 
    };
  }
}