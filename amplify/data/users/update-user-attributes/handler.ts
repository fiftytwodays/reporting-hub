import type { Schema } from "../../resource";
import { env } from "$amplify/env/update-user-attributes";
import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

type Handler = Schema["updateUserAttributes"]["functionHandler"];
const client = new CognitoIdentityProviderClient();

export const handler: Handler = async (event) => {
  const { userName, givenName, familyName, projects, clusters, regions } =
    event.arguments;
  const input = {
    UserPoolId: env.AMPLIFY_AUTH_USERPOOL_ID,
    Username: userName,
    UserAttributes: [
      { Name: "given_name", Value: givenName },
      { Name: "family_name", Value: familyName ? familyName : "" },
      { Name: "custom:projects", Value: projects ? projects : "" },
      { Name: "custom:clusters", Value: clusters ? clusters : "" },
      { Name: "custom:regions", Value: regions ? regions : "" },
    ],
  };
  const command = new AdminUpdateUserAttributesCommand(input);
  const response = await client.send(command);
  return response;
};
