import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

import type { Region } from "../config/types";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  Regions: Region[];
}

export default function useRegionsList({ condition = true }: FetchOptions) {
  const client = generateClient<Schema>();


  const fetcher = async () => {
    const response = await client.models.Region.list();
    if (response?.data) {
      const regions = await Promise.all(
        response.data.map(async (region) => {
          return {
            id: region.id ?? "",
            name: region.name ?? "",
            description: region.description ?? "",
          };
        })
      );
  
      const apiResponse: ApiResponse = {
        Regions: regions
      };
  
      return apiResponse;  
    }
    return null;
  };
  
  
  const { data, isLoading, error } = useSWR(
    condition ? ["api/regions"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadRegionsList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("api/regions")),
      undefined,
      {
        revalidate: true,
      },
    );
  };

  const regionsData = data?.Regions?.map((region, index) => ({
    key: index,
    id: region.id,
    name: region.name,
    description: region.description,
  }));
  return {
    regionsList: regionsData ?? [],
    isRegionsListLoading: isLoading,
    isRegionsListError: error,
    reloadRegionsList
  };
}
