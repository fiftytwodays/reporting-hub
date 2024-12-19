import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

import type { Cluster } from "../config/types";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  Clusters: Cluster[];
}

export default function useClustersList({ condition = true }: FetchOptions) {
  const client = generateClient<Schema>();


  const fetcher = async () => {
    const response = await client.models.Cluster.list();
    if (response?.data) {
      // Use Promise.all to handle async operations for all clusters
      const clusters = await Promise.all(
        response.data.map(async (cluster) => {
          const region = await client.models.Region.get({ id: cluster.regionId ?? "" });
          return {
            id: cluster.id ?? "",
            name: cluster.name ?? "",
            description: cluster.description ?? "",
            regionId: cluster.regionId ?? "",
            region: region.data?.name ?? "",
          };
        })
      );
  
      const apiResponse: ApiResponse = {
        Clusters: clusters
      };
  
      return apiResponse;  
    }
    return null;
  };
  
  
  const { data, isLoading, error } = useSWR(
    condition ? ["api/clusters"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadClustersList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("api/clusters")),
      undefined,
      {
        revalidate: true,
      },
    );
  };

  const clusterData = data?.Clusters?.map((cluster, index) => ({
    key: index,
    id: cluster.id,
    name: cluster.name,
    description: cluster.description,
    region: cluster.region,
    regionId: cluster.regionId,
  }));
  return {
    clustersList: clusterData ?? [],
    isClustersListLoading: isLoading,
    isClustersListError: error,
    reloadClustersList
  };
}
