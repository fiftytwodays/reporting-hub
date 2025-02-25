import { getCurrentUser } from 'aws-amplify/auth';
import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

import type { QuarterlyPlan } from "../config/types";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  QuarterlyPlanList: QuarterlyPlan[];
}

export default function useQuarterlyPlanList({ condition = true }: FetchOptions, id: string|undefined) {
  const client = generateClient<Schema>();



  const fetcher = async () => {
    const { username, userId, signInDetails } = await getCurrentUser();
    const response = await client.models.QuarterlyPlan.list({
      filter: {
        yearlyPlanId: { eq: id },
      },
    });
    if (response?.data) {
      const quarterlyPlans = await Promise.all(
        response.data.map(async (quarterlyPlan) => {
          return {
            approvedBy: quarterlyPlan.approvedBy ?? "",
            quarter: quarterlyPlan.quarter ?? 0,
            yearlyPlanId: quarterlyPlan.yearlyPlanId ?? "",
            id: quarterlyPlan.id ?? "",
            reviewedBy: quarterlyPlan.reviewedBy ?? "",
            status: quarterlyPlan.status ?? "",
            updatedAt: quarterlyPlan.updatedAt ?? "",
          };
        })
      );

      const apiResponse: ApiResponse = {
        QuarterlyPlanList: quarterlyPlans
      };

      return apiResponse;
    }
    return null;
  };


  const { data, isLoading, error } = useSWR(
    condition ? ["api/quarterlyPlanList"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  // const reloadYearlyPlansList = () => {
  //   mutate(
  //     (keys) =>
  //       Array.isArray(keys) &&
  //       keys.some((item) => item.startsWith("api/regions")),
  //     undefined,
  //     {
  //       revalidate: true,
  //     },
  //   );
  // };

  // const yearlyPlansData = data?.YearlyPlanDetails?.map((yearlyPlan, index) => ({
  //   key: index,
  //   id: yearlyPlan.id,
  //   project: yearlyPlan.project,
  //   year: yearlyPlan.year,
  //   status: yearlyPlan.status,
  //   comments: yearlyPlan.comments,
  // }));
  return {
    quarterlyPlanList: data?.QuarterlyPlanList,
    isQuarterlyPlanListLoading: isLoading,
    isQuarterlyPlanListError: error,
    // reloadRegionsList
  };
}
