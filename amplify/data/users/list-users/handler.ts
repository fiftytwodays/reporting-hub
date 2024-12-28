import type { Schema } from "../../resource";
import { env } from "$amplify/env/list-users";
import {
  ListUsersCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

type Handler = Schema["listUsers"]["functionHandler"];
const client = new CognitoIdentityProviderClient();

export const handler: Handler = async () => {
  const command = new ListUsersCommand({
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
  });
  const response = await client.send(command);
  return response;
};
