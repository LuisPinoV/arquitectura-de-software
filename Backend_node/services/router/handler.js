import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION || "us-east-1" });

export const handler = async (event) => {
    console.log("Router received event:", JSON.stringify(event, null, 2));

    try {
        let body;
        try {
            body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        } catch (parseError) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    error: "Invalid JSON in request body",
                    message: parseError.message,
                }),
            };
        }

        const { target, payload, action } = body;


        if (!target) {
            return {
                statusCode: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    error: "Missing required field: target",
                }),
            };
        }

        const targetMap = {
            auth: process.env.AUTH_FUNCTION_ARN,
        };

        const functionArn = targetMap[target];

        if (!functionArn) {
            return {
                statusCode: 404,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    error: `Unknown target: ${target}`,
                    availableTargets: Object.keys(targetMap),
                }),
            };
        }

        let finalPayload = payload;

        if (!payload && action) {
            finalPayload = buildPayloadForAction(target, action, body);
        }

        console.log(`Invoking function: ${functionArn} with payload:`, JSON.stringify(finalPayload, null, 2));

        const invokeParams = {
            FunctionName: functionArn,
            InvocationType: "RequestResponse",
            Payload: JSON.stringify(finalPayload || {}),
        };

        const command = new InvokeCommand(invokeParams);
        const response = await lambdaClient.send(command);

        const responsePayload = JSON.parse(new TextDecoder().decode(response.Payload));

        console.log("Invoked function response:", JSON.stringify(responsePayload, null, 2));

        if (response.FunctionError) {
            return {
                statusCode: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    error: "Target function execution failed",
                    details: responsePayload,
                }),
            };
        }

        return {
            statusCode: responsePayload.statusCode || 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                ...(responsePayload.headers || {}),
            },
            body: responsePayload.body || JSON.stringify(responsePayload),
        };

    } catch (error) {
        console.error("Router error:", error);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                error: "Internal router error",
                message: error.message,
            }),
        };
    }
};

function buildPayloadForAction(target, action, body) {
    if (target === "auth") {
        const actionMap = {
            login: "/auth/login",
            logout: "/auth/logout",
            refresh: "/auth/refresh",
            me: "/auth/me",
            createUser: "/auth/createUser",
            updateUser: "/auth/updateUser",
        };

        const path = actionMap[action];
        if (!path) {
            throw new Error(`Unknown action: ${action} for target: ${target}`);
        }

        const event = {
            rawPath: path,
            requestContext: {
                http: {
                    method: action === "me" ? "GET" : "POST",
                },
            },
            headers: {
                host: "router.internal",
                "content-type": "application/json",
            },
            isBase64Encoded: false,
        };

        if (action !== "me") {
            const bodyData = {};

            if (action === "login") {
                bodyData.username = body.username;
                bodyData.password = body.password;
                //{
                    //"target": "auth",
                    //"action": "login",
                    //"username": "elhombrecoito@gmail.com",
                    //"password": "MamaloMartin123"
                //}

            } else if (action === "logout") {
                bodyData.accessToken = body.accessToken;
            } 
            
            //{
                    //"target": "auth",
                    //"action": "logout",
                    //"accesstoken": "el token"
                //}

                else if (action === "refresh") {
                bodyData.refreshToken = body.refreshToken;
            } else if (action === "createUser") {
                bodyData.username = body.username || body.email;
                bodyData.password = body.password;
                bodyData.name = body.name;
                bodyData.companyName = body.companyName;
                bodyData.spaceName = body.spaceName;
            } else if (action === "updateUser") {
                Object.keys(body).forEach(key => {
                    if (key !== "target" && key !== "action") {
                        bodyData[key] = body[key];
                    }
                });
                event.headers.authorization = body.authorization || `Bearer ${body.accessToken}`;
            }

            event.body = JSON.stringify(bodyData);
        } else {
            event.headers.authorization = body.authorization || `Bearer ${body.accessToken}`;
        }

        return event;
    }

    return body;
}
