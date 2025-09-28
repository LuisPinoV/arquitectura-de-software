import AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider({ region: "us-east-1" });

const userPoolId = process.env.COGNITO_USERPOOL_ID;
const username = "administrador@gmail.com";
const password = "Prueba123!";

(async () => {
  try {
    // Crear usuario
    await cognito.adminCreateUser({
      UserPoolId: userPoolId,
      Username: username,
      UserAttributes: [
        { Name: "email", Value: username },
        { Name: "email_verified", Value: "true" },
      ],
      MessageAction: "SUPPRESS",
    }).promise();

    // Setear contraseña permanente
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

    console.log("✅ Usuario creado correctamente");
  } catch (err) {
    console.error("❌ Error creando usuario:", err);
  }
})();
