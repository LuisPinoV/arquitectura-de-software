/**
 * @param {Object} event - Evento de API Gateway
 * @returns {string} Cognito User ID (sub claim del JWT)
 * @throws {Error} Si no se encuentra el usuario autenticado
 */
export function extractCognitoUserId(event) {
    const cognitoUserId = event.requestContext?.authorizer?.jwt?.claims?.sub;

    if (!cognitoUserId) {
        throw new Error("Usuario no autenticado");
    }

    return cognitoUserId;
}

/**
 * @param {Object} event - Evento de API Gateway
 * @returns {Object} Información del usuario (sub, email, etc.)
 * @throws {Error} Si no se encuentra el usuario autenticado
 */
export function extractCognitoUserInfo(event) {
    const claims = event.requestContext?.authorizer?.jwt?.claims;

    if (!claims || !claims.sub) {
        throw new Error("Usuario no autenticado");
    }

    return {
        userId: claims.sub,
        email: claims.email,
        username: claims['cognito:username'],
        groups: claims['cognito:groups'] || []
    };
}
