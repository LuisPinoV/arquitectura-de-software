import AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider({ region: "us-east-1" });

const userPoolId = process.env.COGNITO_USERPOOL_ID;
const username = "administrador@gmail.com";
const password = "Prueba123!";

(async () => {
  try {
    try {
      await cognito.adminCreateUser({
        UserPoolId: userPoolId,
        Username: username,
        UserAttributes: [
          { Name: "email", Value: username },
          { Name: "email_verified", Value: "true" },
        ],
        MessageAction: "SUPPRESS",
      }).promise();
      console.log("Usuario creado en Cognito");
    } catch (err) {
      if (err.code === "UsernameExistsException") {
        console.log("El usuario ya existe");
      } else {
        throw err;
      }
    }

    // contraseña permanente
    await cognito.adminSetUserPassword({
      UserPoolId: userPoolId,
      Username: username,
      Password: password,
      Permanent: true,
    }).promise();

    // Agregar al grupo
    await cognito.adminAddUserToGroup({
      UserPoolId: userPoolId,
      Username: username,
      GroupName: "Administradores",
    }).promise();

    console.log("Usuario creado");
  } catch (err) {
    console.error("Error creando usuario:", err);
    process.exit(1);
  }
})();
