import { mutate } from "swr";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

export default function useUserDelete(message: any) {
  const client = generateClient<Schema>();

  const onDeleteUser = async (userName?: string) => {
    try {
      await client.mutations.deleteUser({
        userName: userName || "",
      });

      message.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user", error);
      message.error("Failed to delete user");
    }
    mutate(["/api/users"]);
  };

  return {
    onDeleteUser,
  };
}
