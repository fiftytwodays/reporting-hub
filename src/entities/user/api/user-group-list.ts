import useSWR from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

interface FetchOptions {
  condition?: boolean;
  userName: string;
}

export default function useUserGroupList({
  condition = true,
  userName = "",
}: FetchOptions) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const response = await client.mutations.listGroupsForUser({
      userName: userName,
    });
    if (response?.data && typeof response.data === "string") {
      //   return JSON.parse(response.data) as ApiResponse;
      return JSON.parse(response.data);
    }
    return null;
  };

  const { data, isLoading, error } = useSWR(
    condition ? ["api/user-group-list", userName] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  return {
    userGroupList: data?.Groups ?? [],
    isUserGroupListLoading: isLoading,
    isUserGroupListError: error,
  };
}
