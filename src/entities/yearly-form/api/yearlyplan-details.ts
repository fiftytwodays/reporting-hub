import { getCurrentUser } from 'aws-amplify/auth';
import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

import type { YearlyPlanDetails } from "../config/types";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  YearlyPlanDetails: YearlyPlanDetails;
}

export default function useYearlyPlanDetails({ condition = true }: FetchOptions, id: string | undefined) {
  const client = generateClient<Schema>();



  const fetcher = async () => {
    const { username, userId, signInDetails } = await getCurrentUser();
    console.log("User details", username);
    const response = await client.models.YearlyPlan.get({ id: id });
    if (response?.data) {
      
      const yearlyPlanResp = response.data;
      const yearlyPlanDetails = {
        approvedBy: yearlyPlanResp.approvedBy ?? "",
        comments: yearlyPlanResp.comments ?? "",
        createdAt: yearlyPlanResp.createdAt ?? "",
        id: yearlyPlanResp.id ?? "",
        owner: yearlyPlanResp.owner ?? "",
        projectId: yearlyPlanResp.projectId ?? "",
        reviewedBy: yearlyPlanResp.reviewedBy ?? "",
        status: yearlyPlanResp.status ?? "",
        updatedAt: yearlyPlanResp.updatedAt ?? "",
        user: yearlyPlanResp.user ?? "",
        year: yearlyPlanResp.year ?? "",
      }
      console.log("The Year plan Detail", yearlyPlanDetails);
      const apiResponse: ApiResponse = {
        YearlyPlanDetails: yearlyPlanDetails
      };

      return apiResponse;
    }
    return null;
  };


  const { data, isLoading, error } = useSWR(
    condition ? ["api/yearlyPlanDetail"] : null,
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
    yearlyPlanDetail: data?.YearlyPlanDetails,
    isYearlyPlanDetailLoading: isLoading,
    isYearlyPlanDetailError: error,
    // reloadRegionsList
  };
}
