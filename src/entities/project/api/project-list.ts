import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

import type { Project } from "../config/types";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  Projects: Project[];
}

// Helper function to get the email attribute from the user's attributes array
// const getAttributeValue = (
//   attributes: Array<{ Name: string; Value: string }>,
//   attributeName: string
// ) => {
//   const attribute = attributes.find((attr) => attr.Name === attributeName);
//   return attribute ? attribute.Value : "";
// };

export default function useProjectsList({ condition = true }: FetchOptions) {
  const client = generateClient<Schema>();


  const fetcher = async (): Promise<ApiResponse | null> => {
    const response = await client.mutations.listProjects({});
    console.log("response SKMasflm",response);
    if (response?.data && typeof response.data === "string") {
      return JSON.parse(response.data) as ApiResponse;
    }
    return null;
  };
  
  const { data, isLoading, error } = useSWR<ApiResponse | null>(
    condition ? ["api/projects"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const projectData = data?.Projects?.map((project, index) => ({
    key: index,
    Name: project.Name,
    Description: project.Description,
    ProjectType: project.ProjectType,
    Cluster: project.ProjectType,
    Location: project.Location,
    Actions: project.Actions,
  }));

  return {
    projectsList: projectData ?? [],
    isProjectsListLoading: isLoading,
    isProjectsListError: error,
  };
}
