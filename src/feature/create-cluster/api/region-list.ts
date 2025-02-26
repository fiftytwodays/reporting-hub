import type { Schema } from "@root/amplify/data/resource";
import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  Regions: Region[];
}


export interface Region {
  id: string;
  name: string;
}

export default function useRegionsList({ condition = true }: FetchOptions) {

  const client = generateClient<Schema>();


  const fetcher = async () => {
    const response = await client.models.Region.list();
    if (response?.data) {
      const regions = await Promise.all(
        response.data.map(async (region) => {
          return {
            name: region.name ?? "",
            id: region.id ?? "",
          };
        })
      );
  
      regions.sort((a, b) => a.name.localeCompare(b.name));

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

  return {
    regionsData: data?.Regions,
    isRegionsDataLoading: isLoading,
    regionsDataError: error,
  };
}
