const {
  CognitoIdentityProviderClient,
  GlobalSignOutCommand ,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({});

module.exports.logout = async (event) => {
  const { accessToken } = JSON.parse(event.body); // JWT from client

  if (!accessToken) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing access token" }) };
  }

  try {
    const command = new GlobalSignOutCommand({ AccessToken: accessToken });
    await client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Logged out successfully" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};