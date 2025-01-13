import { generateClient } from "aws-amplify/data";

import type { Schema } from "@root/amplify/data/resource";

const client = generateClient<Schema>();

export const addUserToGroup = async (userName: string, groupName: string) => {
  const addUserToGroupInput = {
    userName,
    groupName,
  };
  return await client.mutations.addUserToGroup(addUserToGroupInput);
};

export const createUser = async (values: any) => {
  return await client.mutations.createUser(values);
};

export const setUserPassword = async (
  userName: string,
  password: string,
  permanent: boolean
) => {
  const setPasswordInput = {
    userName,
    password,
    permanent,
  };
  return await client.mutations.setUserPassword(setPasswordInput);
};
