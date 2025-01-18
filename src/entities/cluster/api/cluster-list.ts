import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

interface FetchOptions {
  condition?: boolean;
  filter?: Record<string, any>;
}

const fetchClusterList = async (filter: Record<string, any>) => {
  const client = generateClient<Schema>();
  const { data } = await client.models.Cluster.list({ filter: filter });
  return data;
};

export default function useClusterList({
  condition = true,
  filter = {},
}: FetchOptions = {}) {
  const { data, error, isLoading } = useSWR(
    condition ? ["/api/clusters", filter] : null,
    ([, filter]) => fetchClusterList(filter),
    { keepPreviousData: true }
  );

  const reloadClustersList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("/api/clusters")),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  return {
    clusterList: condition ? data : [],
    isClusterListLoading: isLoading,
    clusterListError: error,
    reloadClustersList: reloadClustersList,
  };
}
