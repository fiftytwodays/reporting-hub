import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

import type { Project } from "../../../entities/project/config/types";
import { useState } from "react";

interface FetchOptions {
  condition: boolean;
  projectId: string;
}

interface ApiResponse {
  Projects: Project;
}

export default function useProjectsDetails({
  condition = true,
  projectId,
}: FetchOptions) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const response = await client.models.Project.get({
      id: projectId,
    });
    // Use Promise.all to handle async operations for all projects
    const project = {
      id: response?.data?.id ?? "",
      name: response?.data?.name ?? "",
      description: response?.data?.description ?? "",
      projectTypeId: response?.data?.projectTypeId ?? "",
      clusterId: response?.data?.clusterId ?? "",
      location: response?.data?.location ?? "",
      projectType: "",
      cluster: "",
    };

    const apiResponse: ApiResponse = {
      Projects: project,
    };

    return apiResponse; // Return the apiResponse instead of response.data to include projectType
  };

  const { data, isLoading, error } = useSWR(
    condition ? ["api/projects"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadProjectList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("api/projects")),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  const projectData = data?.Projects;
  return {
    projectsList: projectData,
    isProjectsListLoading: isLoading,
    isProjectsListError: error,
    reloadProjectList,
  };
}
