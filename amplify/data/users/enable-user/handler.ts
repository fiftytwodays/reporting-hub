import type { Schema } from "../../resource";
import { env } from "$amplify/env/enable-user";
import {
  AdminEnableUserCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

type Handler = Schema["enableUser"]["functionHandler"];
const client = new CognitoIdentityProviderClient();

export const handler: Handler = async (event) => {
  const { userName } = event.arguments;
  const command = new AdminEnableUserCommand({
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
    Username: userName,
  });
  const response = await client.send(command);
  return response;
};
