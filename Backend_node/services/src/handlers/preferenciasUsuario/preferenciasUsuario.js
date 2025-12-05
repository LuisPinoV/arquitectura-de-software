import { AutoRouter } from "itty-router";
import { userPreferencesRepository } from "../../infrastructure/db/preferenciaUsuario.repository.js";
import { PreferenciasUsuarioService } from "../../application/services/preferenciasUsuario.service.js";

const preferenciasService = new PreferenciasUsuarioService(
  userPreferencesRepository
);

// Routing
const router = AutoRouter();

router
  .post("/profile", createProfile)
  .get("/profile/ping", ping)
  .get("/profile/:userId/:profileType", getProfile)
  .get("/profile/:userId", getProfiles)
  .put("/profile/:userId/:profileType", updateProfile)
  .delete("/profile/:userId/:profileType", deleteProfile)
  .get("/profile/current/:userId", getCurrentProfile)
  .put("/profile/current/:userId/:profileType", setCurrentProfile);

router.all("*", () => new Response("Not Found", { status: 404 }));

// Simple ping for diagnostics
async function ping(req) {
  return new Response(JSON.stringify({ ok: true, message: 'profile service alive' }));
}

// Router handler
export const preferenciaUsuarioHandler = async (event) => {
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
    // Quick reply to preflight
    if (method === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        },
        body: '',
      };
    }

    const request = new Request(url, init);
    request.event = event;

    const response = await router.fetch(request);

    // Ensure CORS headers are present on every response
    const responseHeaders = Object.fromEntries(response.headers.entries());
    if (!responseHeaders['access-control-allow-origin']) {
      responseHeaders['Access-Control-Allow-Origin'] = '*';
    }
    if (!responseHeaders['access-control-allow-headers']) {
      responseHeaders['Access-Control-Allow-Headers'] = 'Content-Type,Authorization';
    }
    if (!responseHeaders['access-control-allow-methods']) {
      responseHeaders['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
    }

    return {
      statusCode: response.status,
      headers: responseHeaders,
      body: await response.text(),
    };
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

// Handlers
async function createProfile(req) {
  if (!req.body) {
    return new Response(JSON.stringify({ message: "No hay body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const body = await req.json();
    const { userId, profileType, preferences } = body;

    const profile = await preferenciasService.createProfile(
      userId,
      profileType,
      preferences
    );

    return new Response(JSON.stringify({
      message: "Perfil creado correctamente",
      profile,
    }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function getProfile(req) {
  const { userId, profileType } = req.params;

  try {
    const profile = await preferenciasService.getProfile(userId, profileType);

    if (!profile) {
      return new Response(JSON.stringify({ message: "Perfil no encontrado" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(profile), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function getProfiles(req) {
  const { userId } = req.params;

  try {
    const profiles = await preferenciasService.getProfiles(userId);

    if (profiles.length === 0) {
      return new Response(JSON.stringify({ message: "Usuario no encontrado" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(profiles), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function updateProfile(req) {
  if (!req.body) {
    return new Response(JSON.stringify({ message: "No hay body" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  try {
    const { userId, profileType } = req.params;
    const body = await req.json();

    const updatedProfile = await preferenciasService.updateProfile(
      userId,
      profileType,
      body.preferences
    );

    return new Response(JSON.stringify(updatedProfile), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function deleteProfile(req) {
  try {
    const { userId, profileType } = req.params;
    await preferenciasService.deleteProfile(userId, profileType);

    return new Response(JSON.stringify({ message: "Perfil eliminado correctamente" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function getCurrentProfile(req) {
  const { userId } = req.params;

  try {
    const currentProfile = await preferenciasService.getCurrentProfile(userId);

    return new Response(JSON.stringify(currentProfile), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

async function setCurrentProfile(req) {
  try {
    const { userId, profileType } = req.params;
    await preferenciasService.setCurrentProfile(userId, profileType);

    return new Response(JSON.stringify({ message: "Perfil marcado como actual" }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function onCreatedNewUser(event) {
  console.log("Raw SNS event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const snsMessage = record.Sns.Message;

    try {
      const { username, userId } = JSON.parse(snsMessage);

      console.log("Received SNS message for user creation:");
      console.log("Username:", username);
      console.log("User ID:", userId);

      await preferenciasService.onCreatedUser(userId, username);
    } catch (err) {
      console.error("Failed to process SNS message:", err);
    }
  }

  return new Response(JSON.stringify({
    message: "Created preference image for the new user",
  }), { status: 200, headers: { "Content-Type": "application/json" } });
}
