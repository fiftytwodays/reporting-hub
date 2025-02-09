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
  department?: string;
  comments?: string;
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

export default function useYearlyPlanFullDetails({ condition = true }: FetchOptions, id: string) {
  const client = generateClient<Schema>();

  const fetcher = async (): Promise<ApiResponse | null> => {
    const { username } = await getCurrentUser();
    console.log("User details", username);
    
    const response = await client.models.YearlyPlan.get({ id });
    if (!response?.data) return null;

    const yearlyPlanResp = response.data;

    const yearlyPlanDetails: YearlyPlanDetails = {
      id: yearlyPlanResp.id,
      user: yearlyPlanResp.user,
      projectId: yearlyPlanResp.projectId ?? "",
      comments: yearlyPlanResp.comments ?? "",
      status: yearlyPlanResp.status ?? "",
      year: yearlyPlanResp.year ?? "",
      reviewedBy: yearlyPlanResp.reviewedBy ?? "",
      approvedBy: yearlyPlanResp.approvedBy ?? "",
      quarterlyPlans: {}, // Change: Use an object instead of an array
    };

    // Fetch Quarterly Plans
    const quarterlyPlans = await client.models.QuarterlyPlan.list({
      filter: { yearlyPlanId: { eq: id } },
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
          const plans = await client.models.Plan.list({
            filter: { quarterlyPlanId: { eq: quarterlyPlan.id } },
          });

          quarterlyPlanDetails.plans = (plans?.data || []).map((plan): PlanDetails => ({
            id: plan.id,
            quarterlyPlanId: plan.quarterlyPlanId ?? "",
            activity: plan.activity,
            month: (plan.month || []).map((m) => m ?? ""),
            functionalAreaId: plan.functionalAreaId ?? "",
            department: plan.department ?? "",
            comments: plan.comments ?? "",
          }));

          return [quarterlyPlan.quarter ?? 0, quarterlyPlanDetails];
        })
      )
    );

    console.log("The Yearly Plan Detail", yearlyPlanDetails);
    return { YearlyPlanDetails: yearlyPlanDetails };
  };

  const { data, isLoading, error } = useSWR(
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
  };
}
