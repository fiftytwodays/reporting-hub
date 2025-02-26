import type { Schema } from "@root/amplify/data/resource";
import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  ProjectTypes: ProjectType[];
}


export interface ProjectType {
  id: string;
  name: string;
}

export default function useProjectTypesList({ condition = true }: FetchOptions) {

  const client = generateClient<Schema>();


  const fetcher = async () => {
    const response = await client.models.ProjectType.list();
    if (response?.data) {
      const projectTypes = await Promise.all(
        response.data.map(async (projectType) => {
          return {
            name: projectType.name ?? "",
            id: projectType.id ?? "",
          };
        })
      );
  
      projectTypes.sort((a, b) => a.name.localeCompare(b.name));

      const apiResponse: ApiResponse = {
        ProjectTypes: projectTypes
      };
  
      return apiResponse;  // Return the apiResponse instead of response.data to include projectType
    }
    return null;
  };
  
  
  const { data, isLoading, error } = useSWR(
    condition ? ["api/projectTypes"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  return {
    projectTypesData: data?.ProjectTypes,
    isProjectTypesDataLoading: isLoading,
    projectTypesDataError: error,
  };
}
