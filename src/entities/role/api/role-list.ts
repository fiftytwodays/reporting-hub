import useSWR, { mutate } from "swr";
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
    return JSON.parse(response.data);
  }
  return null;
};

export default function useRoleList({
  condition = true,
  filter = {},
}: FetchOptions) {
  const { data, error, isValidating } = useSWR(
    condition ? ["/api/roles", filter] : null,
    ([, filter]) => fetchRoleList(filter),
    { keepPreviousData: true }
  );

  const reloadRolesList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("/api/roles")),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  return {
    roleList: data?.Groups ?? [],
    isRoleListLoading: isValidating,
    roleListError: error,
    reloadRolesList: reloadRolesList,
  };
}
