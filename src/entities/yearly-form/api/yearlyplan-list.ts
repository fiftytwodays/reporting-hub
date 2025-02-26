import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';
import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

import type { YearlyPlan } from "../config/types";

interface FetchOptions {
  condition: boolean;
  type: string;
}

interface ApiResponse {
  YearlyPlans: YearlyPlan[];
}

export default function useYearlyPlansList({ condition = true, type }: FetchOptions) {
  const client = generateClient<Schema>();
  const fetcher = async () => {
    const { username, userId, signInDetails } = await getCurrentUser();
    const attributes = await fetchUserAttributes();

    let response;
    if (type === "myforms") {
      let projectIdsByCluster: string[] = [];
      let projectIdsByRegion: string[] = [];
      const clusters = attributes["custom:clusters"];
      const clustersArr = stringToArray(clusters);
      if (clustersArr.length > 0) {
        const projects = await client.models.Project.list({
          filter: {
            or: clustersArr.map(clusterId => ({ clusterId: { eq: clusterId } })),
          },
        })
        projectIdsByCluster = projects?.data.map(project => project.id);
      }


      const regions = attributes["custom:regions"];
      const arr = stringToArray(regions);
      if (arr.length > 0) {
        const clusters = await client.models.Cluster.list({
          filter: {
            or: arr.map(regionId => ({ regionId: { eq: regionId } })),
          },
        })
        const clusterIds = clusters?.data.map(cluster => cluster.id);


        const projects = await client.models.Project.list({
          filter: {
            or: clusterIds.map(clusterId => ({ clusterId: { eq: clusterId } })),
          },
        })
        projectIdsByRegion = projects?.data.map(project => project.id);
      }

      const uniqueProjectIds = Array.from(new Set([...projectIdsByCluster, ...projectIdsByRegion]));

      // Construct filter condition
      let filter = {};

      if (uniqueProjectIds.length > 0) {
        filter = {
          or: [
            { userId: { eq: userId } },
            ...uniqueProjectIds.map(projectId => ({ projectId: { eq: projectId } })),
          ],
        };
      } else {
        filter = { userId: { eq: userId } };
      }

      response = await client.models.YearlyPlan.list({
        filter
      });
    }

    if (type === "reviewer") {
      const clusters = attributes["custom:clusters"];
      const arr = stringToArray(clusters);
      if (arr.length > 0) {
        const projects = await client.models.Project.list({
          filter: {
            or: arr.map(clusterId => ({ clusterId: { eq: clusterId } })),
          },
        })
        const projectIds = projects?.data.map(project => project.id);


        response = await client.models.YearlyPlan.list({
          filter: {
            and: [
              {
                or: projectIds.map(projectId => ({ projectId: { eq: projectId } })),
              },
              { status: { eq: "waiting for review" } },
            ],
          },
        });
      }
    }

    if (type === "approver") {
      const regions = attributes["custom:regions"];
      const arr = stringToArray(regions);
      if (arr.length > 0) {
        const clusters = await client.models.Cluster.list({
          filter: {
            or: arr.map(regionId => ({ regionId: { eq: regionId } })),
          },
        })
        const clusterIds = clusters?.data.map(cluster => cluster.id);


        const projects = await client.models.Project.list({
          filter: {
            or: clusterIds.map(clusterId => ({ clusterId: { eq: clusterId } })),
          },
        })
        const projectIds = projects?.data.map(project => project.id);


        response = await client.models.YearlyPlan.list({
          filter: {
            and: [
              {
                or: projectIds.map(projectId => ({ projectId: { eq: projectId } })),
              },
              { status: { eq: "waiting for approval" } },
            ],
          },
        });
      }
    }

    if (response?.data) {
      const yearlyPlans = await Promise.all(
        response.data.map(async (yearlyPlan) => {
          const projectResp = await client.models.Project.get({ id: yearlyPlan.projectId ?? "" });
          return {
            id: yearlyPlan.id ?? "",
            project: projectResp.data?.name ?? "",
            year: yearlyPlan.year ?? "",
            status: yearlyPlan.status ?? "",
            comments: yearlyPlan.comments ?? "",
            user: yearlyPlan.user ?? "",
            userId: yearlyPlan.userId ?? "",
          };
        })
      );

      const apiResponse: ApiResponse = {
        YearlyPlans: yearlyPlans
      };

      return apiResponse;
    }
    return null;
  };


  const { data, isLoading, error } = useSWR(
    condition ? ["api/yearlyPlans"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadYearlyPlansList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("api/yearlyPlans")),
      undefined,
      {
        revalidate: true,
      },
    );
  };

  function stringToArray(str: string | undefined) {
    if (str) {
      const cleanedStr = str.replace(/[\[\]]/g, '').trim();
      if (!cleanedStr) {
        return [];
      }
      const arr = cleanedStr.includes(',') ? cleanedStr.split(',').map(item => item.trim()) : [cleanedStr];
      return arr;
    }
    else {
      return [];
    }
  }

  const yearlyPlansData = data?.YearlyPlans?.map((yearlyPlan, index) => ({
    key: index,
    id: yearlyPlan.id,
    project: yearlyPlan.project,
    year: yearlyPlan.year,
    status: yearlyPlan.status,
    comments: yearlyPlan.comments,
    user: yearlyPlan.user,
  }));
  return {
    yearlyPlansList: yearlyPlansData ?? [],
    isYearlyPlansListLoading: isLoading,
    isYearlyPlansListError: error,
    reloadYearlyPlansList
  };
}
