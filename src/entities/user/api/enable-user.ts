import { mutate } from "swr";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

export default function useUserEnable(message: any) {
  const client = generateClient<Schema>();

  const onEnableUser = async (userName?: string) => {
    try {
      await client.mutations.enableUser({
        userName: userName || "",
      });

      message.success("User enabled successfully");
    } catch (error) {
      console.error("Failed to enable user", error);
      message.error("Failed to enable user");
    }
    mutate(["/api/users"]);
  };

  return {
    onEnableUser,
  };
}
