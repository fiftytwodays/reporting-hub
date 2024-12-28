import type { Schema } from "../../resource";
import { env } from "$amplify/env/delete-user";
import {
  AdminDeleteUserCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

type Handler = Schema["deleteUser"]["functionHandler"];
const client = new CognitoIdentityProviderClient();

export const handler: Handler = async (event) => {
  const { userName } = event.arguments;
  const command = new AdminDeleteUserCommand({
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
    Username: userName,
  });
  const response = await client.send(command);
  return response;
};
