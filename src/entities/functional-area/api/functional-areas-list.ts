import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

import type { FunctionalArea } from "../config/types";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  FunctionalAreas: FunctionalArea[];
}

export default function useFunctionalAreasList({ condition = true }: FetchOptions) {
  const client = generateClient<Schema>();


  const fetcher = async () => {
    const response = await client.models.FunctionalArea.list();
    if (response?.data) {
      const functionalAreas = await Promise.all(
        response.data.map(async (functionalArea) => {
          return {
            id: functionalArea.id ?? "",
            name: functionalArea.name ?? "",
            description: functionalArea.description ?? "",
          };
        })
      );
      functionalAreas.sort((a, b) => a.name.localeCompare(b.name));
      const apiResponse: ApiResponse = {
        FunctionalAreas: functionalAreas
      };
  
      return apiResponse;  
    }
    return null;
  };
  
  
  const { data, isLoading, error } = useSWR(
    condition ? ["api/functional-areas"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadFunctionalAreasList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("api/functional-areas")),
      undefined,
      {
        revalidate: true,
      },
    );
  };

  const functionalAreasData = data?.FunctionalAreas?.map((functionalArea, index) => ({
    key: index,
    id: functionalArea.id,
    name: functionalArea.name,
    description: functionalArea.description,
  }));
  return {
    functionalAreasList: functionalAreasData ?? [],
    isFunctionalAreasListLoading: isLoading,
    isFunctionalAreasListError: error,
    reloadFunctionalAreasList
  };
}
