import type { Schema } from "@root/amplify/data/resource";
import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  Projects: Project[];
}


export interface Project {
  id: string;
  name: string;
  // location: String;
}

export default function useProjectList({ condition = true }: FetchOptions) {

  const client = generateClient<Schema>();


  const fetcher = async () => {
    const response = await client.models.Project.list();
    if (response?.data) {
      const projects = await Promise.all(
        response.data.map(async (project) => {
          return {
            name: project.name ?? "",
            id: project.id ?? "",
          };
        })
      );
  
      const apiResponse: ApiResponse = {
        Projects: projects
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
    projectsData: data?.Projects,
    isProjectTypesDataLoading: isLoading,
    projectTypesDataError: error,
  };
}
