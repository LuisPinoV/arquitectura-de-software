import { AutoRouter } from "itty-router";
import { AuthService } from "../../application/services/auth.service.js";

// Service

const authService = new AuthService();

//Routing
const router = AutoRouter();

router
  .post("/auth/login", loginUser)
  .post("/auth/logout", logoutUser)
  .post("/auth/refresh", refreshUser)
  .post("/auth/createUser", createUser)
  .post("/auth/updateUser", updateUser);

// Reply to preflight requests for any route handled here
router.options(
  "*",
  () =>
    new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      },
    })
);

router.all("*", () => new Response("Not Found", { status: 404 }));

// Router handler
export const cognitoHandler = async (event) => {
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

    // Ensure CORS headers are present on every response
    const responseHeaders = Object.fromEntries(response.headers.entries());
    if (!responseHeaders["access-control-allow-origin"]) {
      responseHeaders["Access-Control-Allow-Origin"] = "*";
    }
    if (!responseHeaders["access-control-allow-headers"]) {
      responseHeaders["Access-Control-Allow-Headers"] =
        "Content-Type,Authorization";
    }
    if (!responseHeaders["access-control-allow-methods"]) {
      responseHeaders["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS";
    }

    return {
      statusCode: response.status,
      headers: responseHeaders,
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

// Helper: tolerant JSON parsing for request bodies
async function parseRequestBody(req) {
  // Read raw text first to avoid consuming body stream twice
  const txt = await req.text();
  if (!txt) return null;

  // Try direct parse
  try {
    return JSON.parse(txt);
  } catch (err) {
    // If it's a quoted JSON string like '"{...}"', strip surrounding quotes and unescape
    try {
      let candidate = txt;
      if (candidate.startsWith('"') && candidate.endsWith('"')) {
        candidate = candidate.substring(1, candidate.length - 1);
        candidate = candidate.replace(/\\"/g, '"');
      }
      return JSON.parse(candidate);
    } catch (err2) {
      throw err2;
    }
  }
}

async function loginUser(req) {
  const body = await parseRequestBody(req);
  const { username, password } = body ?? {};

  if (!username || !password) {
    return new Response(JSON.stringify({ error: "Missing data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const res = await authService.login(username, password);
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Error interno",
        message: err?.message ?? String(err),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function logoutUser(req) {
  const body = await parseRequestBody(req);
  const { accessToken } = body ?? {};

  if (!accessToken)
    return new Response(JSON.stringify({ error: "Missing data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });

  try {
    const res = await authService.logout(accessToken);
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function refreshUser(req) {
  const body = await parseRequestBody(req);
  const { refreshToken } = body ?? {};

  if (!refreshToken)
    return new Response(JSON.stringify({ error: "Missing data" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });

  try {
    const res = await authService.refresh(refreshToken);
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error interno", err }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST - /auth/updateUser
async function updateUser(req) {
  const body = await parseRequestBody(req);

  // Expect Authorization header with access token
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing Authorization header" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const accessToken = authHeader.replace(/^[Bb]earer\s+/i, "");

  try {
    const res = await authService.updateUser(accessToken, body || {});
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error interno", message: err?.message ?? String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

// POST - /auth/createUser
export async function createUser(req) {
  const body = await parseRequestBody(req);

  // Support both payload shapes: { username, password } or { email, password, name, companyName, spaceName }
  const username = body.username ?? body.email ?? null;
  const password = body.password ?? null;
  const name = body.name ?? null;
  const companyName = body.companyName ?? null;
  const spaceName = body.spaceName ?? null;
  const group = body.group ?? "Administradores";

  if (!username || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing data" }),
    };
  }

  try {
    const res = await authService.createUser(
      username,
      password,
      name,
      companyName,
      spaceName,
      group
    );
    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Error interno",
        message: err?.message ?? String(err),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
