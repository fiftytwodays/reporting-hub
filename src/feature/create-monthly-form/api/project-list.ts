import type { Schema } from "@root/amplify/data/resource";
import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";

interface FetchOptions {
  condition: boolean;
  projectId: string;
  type: string;
}

interface ApiResponse {
  Projects: Project[];
}

export interface Project {
  id: string;
  name: string;
  // location: String;
}

export default function useProjectList({
  condition = true,
  projectId,
  type,
}: FetchOptions) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const { username, userId, signInDetails } = await getCurrentUser();
    const attributes = await fetchUserAttributes();
    let projectsList;
    if (type === "myforms") {
      projectsList = attributes["custom:projects"];
      const clusters = attributes["custom:clusters"];
      const regions = attributes["custom:regions"];
      const clustersArr = stringToArray(clusters);
      if (clustersArr.length > 0) {
        const projects = await client.models.Project.list({
          filter: {
            or: clustersArr.map((clusterId) => ({
              clusterId: { eq: clusterId },
            })),
          },
        });
        const existingProjects = stringToArray(projectsList);
        const newProjects = projects?.data.map((project) => project.id) || [];
        projectsList = [...existingProjects, ...newProjects].join(",");
      }
      const arr = stringToArray(regions);
      if (arr.length > 0) {
        const clusters = await client.models.Cluster.list({
          filter: {
            or: arr.map((regionId) => ({ regionId: { eq: regionId } })),
          },
        });
        const clusterIds = clusters?.data.map((cluster) => cluster.id);
        const projects = await client.models.Project.list({
          filter: {
            or: clusterIds.map((clusterId) => ({
              clusterId: { eq: clusterId },
            })),
          },
        });
        const existingProjects = stringToArray(projectsList);
        const newProjects = projects?.data.map((project) => project.id) || [];
        projectsList = [...existingProjects, ...newProjects].join(",");
      }
      const uniqueProjectIds = Array.from(
        new Set(
          [...stringToArray(projectsList), projectId]
            .filter((projectId) => projectId !== "project")
            .filter((projectId) => projectId !== "")
        )
      );
      projectsList = uniqueProjectIds.join(",");
    }

    if (type === "approver") {
      const clusters = attributes["custom:clusters"];
      const clustersArr = stringToArray(clusters);
      if (clustersArr.length > 0) {
        const projects = await client.models.Project.list({
          filter: {
            or: clustersArr.map((clusterId) => ({
              clusterId: { eq: clusterId },
            })),
          },
        });
        const newProjects = projects?.data.map((project) => project.id) || [];
        projectsList = [...newProjects].join(",");
      }
    }

    if (type === "user") {
      projectsList = attributes["custom:projects"];
    }
    const projectsArray = stringToArray(projectsList);

    if (
      !projectsArray ||
      (projectsArray.length === 0 && projectId === "project")
    ) {
      return { Projects: [] };
    } else {
      if (!projectsArray.includes(projectId)) {
        projectsArray.push(projectId);
      }
    }
    const response = await client.models.Project.list({
      filter: {
        or: projectsArray.map((projectId) => ({ id: { eq: projectId } })),
      },
    });
    if (response?.data) {
      const projects = await Promise.all(
        response.data.map(async (project) => {
          return {
            name: project.name ?? "",
            id: project.id ?? "",
          };
        })
      );

      projects.sort((a, b) => a.name.localeCompare(b.name));

      const apiResponse: ApiResponse = {
        Projects: projects,
      };

      return apiResponse; // Return the apiResponse instead of response.data to include projectType
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

  function stringToArray(str: string | undefined) {
    if (str) {
      const cleanedStr = str.replace(/[\[\]]/g, "").trim();
      if (!cleanedStr) {
        return [];
      }
      const arr = cleanedStr.includes(",")
        ? cleanedStr.split(",").map((item) => item.trim())
        : [cleanedStr];
      return arr;
    } else {
      return [];
    }
  }
  return {
    projectsData: data?.Projects,
    isProjectTypesDataLoading: isLoading,
    projectTypesDataError: error,
  };
}
