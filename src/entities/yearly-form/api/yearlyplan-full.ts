import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import useSWR from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

interface FetchOptions {
  condition: boolean;
}

interface PlanDetails {
  id: string;
  quarterlyPlanId: string;
  activity: string;
  month: string[];
  functionalAreaId: string;
  comments?: string;
  isMajorGoal: boolean;

}

interface QuarterlyPlanDetails {
  id: string;
  yearlyPlanId: string;
  status?: string;
  reviewedBy?: string;
  approvedBy?: string;
  plans: PlanDetails[];
}

interface YearlyPlanDetails {
  id: string;
  user: string;
  userId: string;
  projectId?: string;
  comments?: string;
  status?: string;
  year?: string;
  reviewedBy?: string;
  approvedBy?: string;
  quarterlyPlans: Record<number, QuarterlyPlanDetails>; // Change: Key is quarter number
}

interface ApiResponse {
  YearlyPlanDetails: YearlyPlanDetails;
}

export default function useYearlyPlanFullDetails({ condition = true }: FetchOptions, id: string | undefined) {
  const client = generateClient<Schema>();

  const fetcher = async (): Promise<ApiResponse | null> => {
    if (id) {
      const { username } = await getCurrentUser();
      const response = await client.models.YearlyPlan.get({ id });
      if (!response?.data) return null;

      const yearlyPlanResp = response.data;

      const yearlyPlanDetails: YearlyPlanDetails = {
        id: yearlyPlanResp.id,
        user: yearlyPlanResp.user ?? "",
        userId: yearlyPlanResp.userId,
        projectId: yearlyPlanResp.projectId ?? "",
        comments: yearlyPlanResp.comments ?? "",
        status: yearlyPlanResp.status ?? "",
        year: yearlyPlanResp.year ?? "",
        reviewedBy: yearlyPlanResp.reviewedBy ?? "",
        approvedBy: yearlyPlanResp.approvedBy ?? "",
        quarterlyPlans: {}, // Change: Use an object instead of an array
      };

      // Fetch Quarterly Plans
      // const quarterlyPlans = await client.models.QuarterlyPlan.list({
      //   filter: { yearlyPlanId: { eq: id } },
      // });
      const quarterlyPlans = await client.models.QuarterlyPlan.listQuarterlyPlanByYearlyPlanId({
         yearlyPlanId:  id ,
      });

      yearlyPlanDetails.quarterlyPlans = Object.fromEntries(
        await Promise.all(
          (quarterlyPlans?.data || []).map(async (quarterlyPlan): Promise<[number, QuarterlyPlanDetails]> => {
            const quarterlyPlanDetails: QuarterlyPlanDetails = {
              id: quarterlyPlan.id,
              yearlyPlanId: quarterlyPlan.yearlyPlanId ?? "",
              status: quarterlyPlan.status ?? "",
              reviewedBy: quarterlyPlan.reviewedBy ?? "",
              approvedBy: quarterlyPlan.approvedBy ?? "",
              plans: [],
            };

            // Fetch Plans for each Quarterly Plan
            // quarterlyPlanId
            // const plans = await client.models.Plan.list({
            //   filter: { quarterlyPlanId: { eq: quarterlyPlan.id } },
            // });
            const plans = await client.models.Plan.listPlanByQuarterlyPlanId({
              quarterlyPlanId: quarterlyPlan.id ,
            });
            const sortedPlans = plans?.data.sort((a: any, b: any) => (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));

            quarterlyPlanDetails.plans = (plans?.data || []).map((plan): PlanDetails => ({
              id: plan.id,
              quarterlyPlanId: plan.quarterlyPlanId ?? "",
              activity: plan.activity,
              month: (plan.month || []).map((m) => m ?? ""),
              functionalAreaId: plan.functionalAreaId ?? "",
              comments: plan.comments ?? "",
              isMajorGoal: plan.isMajorGoal ?? false,
            }));
            return [quarterlyPlan.quarter ?? 0, quarterlyPlanDetails];
          })
        )
      );

      return { YearlyPlanDetails: yearlyPlanDetails };
    } return null;
  };

  const { data, isLoading, error, mutate } = useSWR(
    condition ? ["api/yearlyPlanDetail", id] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  return {
    yearlyPlanDetail: data?.YearlyPlanDetails,
    isYearlyPlanDetailLoading: isLoading,
    isYearlyPlanDetailError: error,
    mutateYearlyPlanDetail: mutate,
  };
}
