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
    console.log("User details", username);
    console.log("Attributes", attributes);
    const clusters = attributes["custom:clusters"];

    // const projects = await client.models.Project.list({
    //   filter: {
    //     or: clusters.map(clusterId => ({ clusterId: { eq: clusterId } })),
    //   },
    // })

    const response = await client.models.YearlyPlan.list({
      filter: {
        user: { eq: userId },
      },
    });
    if (response?.data) {
      console.log("The complete response", response, response.data);
      const yearlyPlans = await Promise.all(
        response.data.map(async (yearlyPlan) => {
          const projectResp = await client.models.Project.get({ id: yearlyPlan.projectId ?? "" });
          return {
            id: yearlyPlan.id ?? "",
            project: projectResp.data?.name ?? "",
            year: yearlyPlan.year ?? "",
            status: yearlyPlan.status ?? "",
            comments: yearlyPlan.comments ?? "",
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

  const yearlyPlansData = data?.YearlyPlans?.map((yearlyPlan, index) => ({
    key: index,
    id: yearlyPlan.id,
    project: yearlyPlan.project,
    year: yearlyPlan.year,
    status: yearlyPlan.status,
    comments: yearlyPlan.comments,
  }));
  return {
    yearlyPlansList: yearlyPlansData ?? [],
    isYearlyPlansListLoading: isLoading,
    isYearlyPlansListError: error,
    reloadYearlyPlansList
  };
}
