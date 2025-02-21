import type { Schema } from "@root/amplify/data/resource";
import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  FunctionalAreas: FunctionalArea[];
}


export interface FunctionalArea {
  id: string;
  name: string;
  // location: String;
}

export default function useFunctionalAreaList({ condition = true }: FetchOptions) {

  const client = generateClient<Schema>();


  const fetcher = async () => {
    const response = await client.models.FunctionalArea.list();
    if (response?.data) {
      const functionalAreas = await Promise.all(
        response.data.map(async (functionalArea) => {
          return {
            name: functionalArea.name ?? "",
            id: functionalArea.id ?? "",
          };
        })
      );
  
      const apiResponse: ApiResponse = {
        FunctionalAreas: functionalAreas
      };
  
      return apiResponse;  // Return the apiResponse instead of response.data to include functionalArea
    }
    return null;
  };
  
  
  const { data, isLoading, error } = useSWR(
    condition ? ["api/functionalAreas"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  return {
    functionalAreasData: data?.FunctionalAreas,
    isFunctionalAreaTypesDataLoading: isLoading,
    functionalAreaTypesDataError: error,
  };
}
