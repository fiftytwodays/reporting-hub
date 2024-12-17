import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

import type { Project } from "../config/types";
import { useState } from "react";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  Projects: Project[];
}

export default function useProjectsList({ condition = true }: FetchOptions) {
  const client = generateClient<Schema>();


  const fetcher = async () => {
    const response = await client.models.Project.list();
    if (response?.data) {
      // Use Promise.all to handle async operations for all projects
      const projects = await Promise.all(
        response.data.map(async (project) => {
          const projectType = await client.models.ProjectType.get({ id: project.projectTypeId ?? "" });
          const cluster = await client.models.Cluster.get({ id: project.clusterId ?? "" });
          return {
            id: project.id ?? "",
            name: project.name ?? "",
            description: project.description ?? "",
            projectTypeId: project.projectTypeId ?? "",
            clusterId: project.clusterId ?? "",
            location: project.location ?? "",
            projectType: projectType.data?.name ?? "",  // projectType should be fetched asynchronously
            cluster: cluster.data?.name ?? "",
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
      },
    );
  };

  const projectData = data?.Projects?.map((project, index) => ({
    key: index,
    id: project.id,
    name: project.name,
    description: project.description,
    projectType: project.projectType,
    cluster: project.cluster,
    location: project.location,
    projectTypeId: project.projectTypeId,
    clusterId: project.clusterId
    // Actions: project.actions,
  }));
  return {
    projectsList: projectData ?? [],
    isProjectsListLoading: isLoading,
    isProjectsListError: error,
    reloadProjectList
  };
}
