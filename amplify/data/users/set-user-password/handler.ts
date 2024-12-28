import type { Schema } from "../../resource";
import { env } from "$amplify/env/set-user-password";
import {
  AdminSetUserPasswordCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

type Handler = Schema["setUserPassword"]["functionHandler"];
const client = new CognitoIdentityProviderClient();

export const handler: Handler = async (event) => {
  const { userName, password, permanent } = event.arguments;
  const command = new AdminSetUserPasswordCommand({
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
    Username: userName,
    Password: password,
    Permanent: permanent,
  });
  const response = await client.send(command);
  return response;
};
