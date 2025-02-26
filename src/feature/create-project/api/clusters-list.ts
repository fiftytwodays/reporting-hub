import type { Schema } from "@root/amplify/data/resource";
import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  Clusters: Cluster[];
}


export interface Cluster {
  id: string;
  name: string;
}

export default function useClustersList({ condition = true }: FetchOptions) {

  const client = generateClient<Schema>();


  const fetcher = async () => {
    const response = await client.models.Cluster.list();
    if (response?.data) {
      const clusters = await Promise.all(
        response.data.map(async (cluster) => {
          return {
            name: cluster.name ?? "",
            id: cluster.id ?? "",
          };
        })
      );
  
      clusters.sort((a, b) => a.name.localeCompare(b.name));

      const apiResponse: ApiResponse = {
        Clusters: clusters
      };
  
      return apiResponse;  // Return the apiResponse instead of response.data to include projectType
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

  return {
    clustersData: data?.Clusters,
    isClustersDataLoading: isLoading,
    clustersDataError: error,
  };
}
