import { AutoRouter } from "itty-router";
import { BoxService } from "../../application/services/box.service.js";
import { extractCognitoUserId } from "../../middleware/auth.middleware.js";

// Service

const boxService = new BoxService();

//Routing
const router = AutoRouter();

router
  .post("/box", createBox)
  .get("/box/inventario", getAllInventarios)
  .get("/box/agendamientos/:idBox", getBoxAgendamientos)
  .get("/box/disponibilidad/:idBox/:fecha", getDisponibilidadBox) // ejemploPro: /box/disponibilidad/1/2025-11-04
  .get("/box/porcentaje-uso/:fecha/:hora", getPorcentajeUsoBoxes) // ejemploPro: /box/porcentaje-uso/2025-11-07/14:30
  .get("/box/ocupacion-especialidad/:fecha/:hora", getOcupacionPorEspecialidad) // ejemploPro: /box/ocupacion-especialidad/2025-11-07/14:30
  .get("/box/uso/:idBox/:fecha/:hora", getUsoBox)  // ejemploPro: /box/uso/10/2025-11-07/14:00
  .get("/box/:idBox/inventario", getInventario)
  .post("/box/:idBox/inventario", updateInventario)
  .delete("/box/:idBox/inventario", deleteInventario)
  .get("/box/:idBox", getBox)
  .get("/box", getAllBoxes)
  .put("/box/:idBox", updateBox)
  .delete("/box/:idBox", deleteBox);


router.all("*", () => new Response("Not Found", { status: 404 }));

// Router handler
export const boxHandler = async (event) => {
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
      body: JSON.stringify({ error: err.message }),
    };
  }
};

// Handlers

async function getDisponibilidadBox(req) {
  const { idBox, fecha } = req.params;

  if (!idBox || !fecha) {
    return new Response(JSON.stringify({ error: "idBox y fecha requeridos" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const result = await boxService.getDisponibilidadBox(idBox, fecha);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en getDisponibilidadBox:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function getPorcentajeUsoBoxes(req) {
  const { fecha, hora } = req.params;

  if (!fecha || !hora) {
    return new Response(JSON.stringify({ error: "fecha y hora requeridas" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const result = await boxService.getPorcentajeUsoBoxes(fecha, hora);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en getPorcentajeUsoBoxes:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function getOcupacionPorEspecialidad(req) {
  const { fecha, hora } = req.params;

  if (!fecha || !hora) {
    return new Response(JSON.stringify({ error: "fecha y hora requeridas" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const result = await boxService.getOcupacionPorEspecialidad(fecha, hora);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en getOcupacionPorEspecialidad:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function getUsoBox(req) {
  const { idBox, fecha, hora } = req.params;

  if (!idBox || !fecha || !hora) {
    return new Response(JSON.stringify({ error: "idBox, fecha y hora requeridos" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const result = await boxService.getUsoBox(idBox, fecha, hora);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en getUsoBox:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


async function createBox(req) {

  if (!req.body) return new Response(JSON.stringify({ message: "No hay body" }), { status: 400, headers: { "Content-Type": "application/json" } });

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const body = await req.json();
    console.log("Body recibido en createBox:", JSON.stringify(body));
    const box = await boxService.createBox(body, organizacionId);
    console.log("Box creado exitosamente:", JSON.stringify(box));
    return new Response(JSON.stringify(box), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al crear box:", error);
    console.error("Stack trace:", error.stack);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({
      message: error.message
    }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getBox(req) {
  const { idBox } = req.params;

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const box = await boxService.getBox(idBox, organizacionId);
    if (!box)
      return new Response(JSON.stringify({ message: "Box no encontrado" }), { status: 404, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify(box), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener box:", error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getAllBoxes(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const boxes = await boxService.getBoxes(organizacionId);
    return new Response(JSON.stringify(boxes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al obtener boxes:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function updateBox(req) {

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { idBox } = req.params;
    const updates = await req.json();
    const updated = await boxService.updateBox(idBox, updates, organizacionId);
    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al actualizar box:", error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function deleteBox(req) {

  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { idBox } = req.params;
    const deleted = await boxService.deleteBox(idBox, organizacionId);
    return new Response(JSON.stringify(deleted), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al eliminar box:", error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getBoxAgendamientos(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { idBox } = req.params;
    const box = await boxService.getBox(idBox, organizacionId);

    if (!box)
      return new Response(JSON.stringify({ message: "Box no encontrado" }), { status: 404, headers: { "Content-Type": "application/json" } });

    const agendamientos = await boxService.getAgendamientosByBox(idBox);
    return new Response(JSON.stringify({ box, agendamientos }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al obtener agendamientos del box:", error);
    const status = error.message.includes("autenticado") ? 401
      : error.message.includes("permiso") ? 403
        : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getInventario(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { idBox } = req.params;
    const inventario = await boxService.getInventario(idBox, organizacionId);
    return new Response(JSON.stringify(inventario), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function getAllInventarios(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const inventarios = await boxService.getAllInventarios(organizacionId);
    return new Response(JSON.stringify(inventarios), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al obtener inventarios:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function updateInventario(req) {
  if (!req.body) return new Response(JSON.stringify({ message: "No hay body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { idBox } = req.params;
    const inventario = await req.json();
    const updated = await boxService.updateInventario(idBox, inventario, organizacionId);
    return new Response(JSON.stringify(updated), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al actualizar inventario:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

async function deleteInventario(req) {
  try {
    const organizacionId = extractCognitoUserId(req.event);
    const { idBox } = req.params;
    const deleted = await boxService.deleteInventario(idBox, organizacionId);
    return new Response(JSON.stringify(deleted), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error al eliminar inventario:", error);
    const status = error.message.includes("autenticado") ? 401 : 500;
    return new Response(JSON.stringify({ message: error.message }), { status, headers: { "Content-Type": "application/json" } });
  }
}

