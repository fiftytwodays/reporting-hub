import type { Schema } from "../../resource";
import { env } from "$amplify/env/create-user";
import {
  AdminCreateUserCommand,
  CognitoIdentityProviderClient,
  MessageActionType,
} from "@aws-sdk/client-cognito-identity-provider";
import Password from "antd/es/input/Password";

type Handler = Schema["createUser"]["functionHandler"];
const client = new CognitoIdentityProviderClient();

export const handler: Handler = async (event) => {
  const {
    userName,
    email,
    givenName,
    familyName,
    password,
    projects,
    clusters,
    regions,
  } = event.arguments;
  const input = {
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
    Username: userName,
    TemporaryPassword: password,
    MessageAction: MessageActionType.SUPPRESS,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "email_verified", Value: "true" },
      { Name: "given_name", Value: givenName },
      { Name: "family_name", Value: familyName ? familyName : "" },
      { Name: "custom:projects", Value: projects ? projects : "" },
      { Name: "custom:clusters", Value: clusters ? clusters : "" },
      { Name: "custom:regions", Value: regions ? regions : "" },
    ],
  };
  const command = new AdminCreateUserCommand(input);
  const response = await client.send(command);
  return response;
};
