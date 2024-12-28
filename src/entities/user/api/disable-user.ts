import { mutate } from "swr";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

export default function useUserDisable(message: any) {
  const client = generateClient<Schema>();

  const onDisableUser = async (userName?: string) => {
    try {
      await client.mutations.disableUser({
        userName: userName || "",
      });

      message.success("User disabled successfully");
    } catch (error) {
      console.error("Failed to disable user", error);
      message.error("Failed to disable user");
    }
    mutate(["/api/users"]);
  };

  return {
    onDisableUser,
  };
}
