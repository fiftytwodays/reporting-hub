import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

import type { User } from "../config/types";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  Users: User[];
}

// Helper function to get the email attribute from the user's attributes array
const getAttributeValue = (
  attributes: Array<{ Name: string; Value: string }>,
  attributeName: string
) => {
  const attribute = attributes.find((attr) => attr.Name === attributeName);
  return attribute ? attribute.Value : "";
};

export default function useUsersList({ condition = true }: FetchOptions) {
  const client = generateClient<Schema>();

  const fetcher = async (): Promise<ApiResponse | null> => {
    const response = await client.mutations.listUsers({});
    if (response?.data && typeof response.data === "string") {
      return JSON.parse(response.data) as ApiResponse;
    }
    return null;
  };

  const { data, isLoading, error } = useSWR<ApiResponse | null>(
    condition ? ["api/users"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const userData = data?.Users?.map((user, index) => ({
    key: index,
    Username: user.Username,
    Email: getAttributeValue(user?.Attributes ?? [], "email"),
    Enabled: user.Enabled,
    UserCreateDate: user.UserCreateDate,
    UserLastModifiedDate: user.UserLastModifiedDate,
    UserStatus: user.UserStatus,
  }));

  return {
    usersList: userData ?? [],
    isUsersListLoading: isLoading,
    isUsersListError: error,
  };
}
