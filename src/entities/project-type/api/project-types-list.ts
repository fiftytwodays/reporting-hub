import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";
import { ProjectType } from "../config/types";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  ProjectTypes: ProjectType[];
}

export default function useProjectTypesList({
  condition = true,
}: FetchOptions) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const response = await client.models.ProjectType.list();
    if (response?.data) {
      const projectTypes = await Promise.all(
        response.data.map(async (ProjectType) => {
          return {
            id: ProjectType.id ?? "",
            name: ProjectType.name ?? "",
            description: ProjectType.description ?? "",
          };
        })
      );

      projectTypes.sort((a, b) => a.name.localeCompare(b.name));

      const apiResponse: ApiResponse = {
        ProjectTypes: projectTypes,
      };

      return apiResponse;
    }
    return null;
  };

  const { data, isLoading, error } = useSWR(
    condition ? ["api/project-types"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadProjectTypesList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("api/project-types")),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  const projectTypesData = data?.ProjectTypes?.map((projectType, index) => ({
    key: index,
    id: projectType.id,
    name: projectType.name,
    description: projectType.description,
  }));
  return {
    projectTypesList: projectTypesData ?? [],
    isProjectTypesListLoading: isLoading,
    isProjectTypesListError: error,
    reloadProjectTypesList,
  };
}
