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
  .get("/profile/:userId/:profileType", getProfile)
  .get("/profile/:userId", getProfiles)
  .put("/profile/:userId/:profileType", updateProfile)
  .delete("/profile/:userId/:profileType", deleteProfile)
  .get("/profile/current/:userId", getCurrentProfile)
  .put("/profile/current/:userId/:profileType", setCurrentProfile);

router.all("*", () => new Response("Not Found", { status: 404 }));

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
async function createProfile(req) {
  if (!req.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No hay body" }),
    };
  }

  try {
    const body = await req.json();
    const { userId, profileType, preferences } = body;

    const profile = await preferenciasService.createProfile(
      userId,
      profileType,
      preferences
    );

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Perfil creado correctamente",
        profile,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function getProfile(req) {
  const { userId, profileType } = req.params;

  try {
    const profile = await preferenciasService.getProfile(userId, profileType);

    if (!profile) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Perfil no encontrado" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(profile),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function getProfiles(req) {
  const { userId } = req.params;

  try {
    const profiles = await preferenciasService.getProfiles(userId);

    if (profiles.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Usuario no encontrado" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(profiles),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function updateProfile(req) {
  if (!req.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "No hay body" }),
    };
  }

  try {
    const { userId, profileType } = req.params;
    const body = await req.json();

    const updatedProfile = await preferenciasService.updateProfile(
      userId,
      profileType,
      body.preferences
    );

    return {
      statusCode: 200,
      body: JSON.stringify(updatedProfile),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function deleteProfile(req) {
  try {
    const { userId, profileType } = req.params;
    await preferenciasService.deleteProfile(userId, profileType);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Perfil eliminado correctamente" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function getCurrentProfile(req) {
  const { userId } = req.params;

  try {
    const currentProfile = await preferenciasService.getCurrentProfile(userId);

    return {
      statusCode: 200,
      body: JSON.stringify(currentProfile),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}

async function setCurrentProfile(req) {
  try {
    const { userId, profileType } = req.params;
    await preferenciasService.setCurrentProfile(userId, profileType);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Perfil marcado como actual" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
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

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Created preference image for the new user",
    }),
  };
}
