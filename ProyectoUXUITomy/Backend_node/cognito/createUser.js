const {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient();

module.exports.createUser = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const command = new AdminCreateUserCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
      TemporaryPassword: password,
      UserAttributes: [
        { Name: "email", Value: username },
        { Name: "email_verified", Value: "true" },
      ],
      MessageAction: "SUPPRESS",
      DesiredDeliveryMediums: [],
    });

    const response = await client.send(command);

    await client.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: process.env.USER_POOL_ID,
        Username: username,
        Password: password,
        Permanent: true,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User created successfully",
        user: response.User,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
