import { AutoRouter } from "itty-router";
import { AuthService } from "../../application/services/auth.service.js";

// Service

const authService = new AuthService();

//Routing
const router = AutoRouter();

router
  .post("/auth/createUser", createUser)
  //.post("/auth/login", loginUser)
  //.post("/auth/logout", logoutUser) 
  //.post("/auth/refresh", refreshUser);

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

async function createUser(req)
{
    const { userName, password } = JSON.parse(req.body);

    console.log(userName);

}