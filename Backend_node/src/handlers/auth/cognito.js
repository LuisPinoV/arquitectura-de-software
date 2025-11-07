import { AutoRouter } from "itty-router";
import { AuthService } from "../../application/services/auth.service.js";

// Service

const authService = new AuthService();

//Routing
const router = AutoRouter();

router
  .post("/auth/login", loginUser)
  .post("/auth/logout", logoutUser)
  .post("/auth/refresh", refreshUser);

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

async function loginUser(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing data" }),
    };
  }

  try {
    const res = await authService.login(username, password);
    return { statusCode: 200, body: JSON.stringify(res) };
  } catch (err) {
    console.error("Error login user: ", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}

async function logoutUser(req) {
  const { accessToken } = await req.json();

  if (!accessToken)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing data" }),
    };

  try {
    const res = await authService.logout(accessToken);
    return { statusCode: 200, body: JSON.stringify(res) };
  } catch (err) {
    console.error("Error on logout: ", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}

async function refreshUser(req) {
  const { refreshToken } = await req.json();

  if (!refreshToken)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing data" }),
    };

  try {
    const res = await authService.refresh(refreshToken);
    return { statusCode: 200, body: JSON.stringify(res) };
  } catch (err) {
    console.error("Error on logout: ", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}

// POST - /admin/createUser
export async function createUser(event) {
  const { username, password } = JSON.parse(event.body);

  const claims = event.requestContext?.authorizer?.jwt.claims;

  console.log(claims);

  if (!claims) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized: no token claims" }),
    };
  }

  const groups = claims["cognito:groups"] || [];

  if (!groups.includes("Administradores")) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Forbidden: admin access required" }),
    };
  }

  console.log(username, password);

  if (!username || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing data" }),
    };
  }

  try {
    const res = await authService.createUser(username, password);
    return { statusCode: 200, body: JSON.stringify(res) };
  } catch (err) {
    console.error("Error creating user: ", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno" }),
    };
  }
}

