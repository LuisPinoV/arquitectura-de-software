import { AutoRouter } from "itty-router";
import { BoxService } from "../../application/services/box.service.js";

// Service

const boxService = new BoxService();

//Routing
const router = AutoRouter();

router
  .post("/box", createBox)
  .get("/box/:idBox", getBox)
  .get("/box", getAllBoxes)
  .put("/box/:idBox", updateBox)
  .delete("/box/:idBox", deleteBox)
  .get("/box/agendamientos/:idBox", getBoxAgendamientos);

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
      body: JSON.stringify({ error: err.message }),
    };
  }
};

// Handlers
async function createBox(req) {

  if(!req.body) return  {
      statusCode: 500,
      body: JSON.stringify({ message: "No hay body" }),
    };

  try {
    const body = req.json();
    const box = await boxService.createBox(body);
    return {
      statusCode: 201,
      body: JSON.stringify(box),
    };
  } catch (error) {
    console.error("Error al crear box:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
}

async function getBox(req) {
  const { idBox } = req.params;

  try {
    const box = await boxService.getBox(idBox);
    if (!box)
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Box no encontrado" }),
      };
    return { statusCode: 200, body: JSON.stringify(box) };
  } catch (error) {
    console.error("Error al obtener box:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
}

async function getAllBoxes(_) {
  try {
    const boxes = await boxService.getBoxes();
    return { statusCode: 200, body: JSON.stringify(boxes) };
  } catch (error) {
    console.error("Error al obtener boxes:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
}

async function updateBox(req) {

  try {
    const { idBox } = req.params;
    const updates = req.json();
    const updated = await boxService.updateBox(idBox, updates);
    return { statusCode: 200, body: JSON.stringify(updated) };
  } catch (error) {
    console.error("Error al actualizar box:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
}

async function deleteBox(req) {

  try {
    const { idBox } = req.params;
    const deleted = await boxService.deleteBox(idBox);
    return { statusCode: 200, body: JSON.stringify(deleted) };
  } catch (error) {
    console.error("Error al eliminar box:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
}

async function getBoxAgendamientos(req) {
  try {
    const { idBox } = req.params;
    const box = await boxService.getBox(idBox);

    if (!box)
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Box no encontrado" }),
      };

    const agendamientos = await boxService.getAgendamientosByBox(idBox);
    return {
      statusCode: 200,
      body: JSON.stringify({ box, agendamientos }),
    };
  } catch (error) {
    console.error("Error al obtener agendamientos del box:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
}
