import useSWR from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

interface FetchOptions {
  condition?: boolean;
  filter?: Record<string, any>;
}

const fetchRoleList = async (filter: Record<string, any>) => {
  const client = generateClient<Schema>();
  const response = await client.mutations.listGroups({ filter });
  if (response?.data && typeof response.data === "string") {
    //   return JSON.parse(response.data) as ApiResponse;
    return JSON.parse(response.data);
  }
  return null;
};

export default function useRoleList({
  condition = true,
  filter = {},
}: FetchOptions) {
  const { data, error, isValidating } = useSWR(
    condition ? ["/api/role-list", filter] : null,
    ([, filter]) => fetchRoleList(filter),
    { keepPreviousData: true }
  );

  return {
    roleList: data?.Groups ?? [],
    isRoleListLoading: isValidating,
    roleListError: error,
  };
}
