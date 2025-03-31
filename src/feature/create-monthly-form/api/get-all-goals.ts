import { Plan, YearlyPlan } from "@/shared/config/model";
import type { Schema } from "@root/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { Goal } from "../config/monthly-form";

interface FetchOptions {
  condition: boolean;
  projectId: string;
  userId: string;
  month: number;
  year: number;
}

interface ApiResponse {
  Plans: { CurrentMonthGoals: Goal[]; NextMonthGoals: Goal[] };
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getMonthName = (month: number) =>
  monthNames[month - 1] || "Invalid month";

const getYearString = (year: number, quarter: number) =>
  quarter === 4 ? `${year - 1}-${year}` : `${year}-${year + 1}`;

const sortPlans = (plans: any[]) =>
  plans.sort((a, b) => a.activity.localeCompare(b.activity));

export default function usePlansFetcher({
  condition,
  projectId,
  userId,
  month,
  year,
}: FetchOptions) {
  const client = generateClient<Schema>();

  const fetcher = async (): Promise<ApiResponse> => {
    try {
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const quarter =
        Math.ceil(month / 3) - 1 === 0 ? 4 : Math.ceil(month / 3) - 1;
      const nextQuarter =
        Math.ceil(nextMonth / 3) - 1 === 0 ? 4 : Math.ceil(nextMonth / 3) - 1;
      const years = getYearString(year, quarter);
      const nextYears = getYearString(nextYear, nextQuarter);

      console.log("Fetching plans for:", {
        projectId,
        userId,
        month: getMonthName(month),
        quarter,
        years,
      });

      const yearlyPlansResponse =
        await client.models.YearlyPlan.listYearlyPlanByUserId({ userId });
      if (!yearlyPlansResponse?.data)
        return { Plans: { CurrentMonthGoals: [], NextMonthGoals: [] } };

      const yearlyPlan = yearlyPlansResponse.data.find(
        (yp) => yp.year === years && yp.projectId === projectId
      );
      if (!yearlyPlan)
        return { Plans: { CurrentMonthGoals: [], NextMonthGoals: [] } };

      const quarterlyPlansResponse = await yearlyPlan.quarterlyPlan();
      if (!quarterlyPlansResponse?.data)
        return { Plans: { CurrentMonthGoals: [], NextMonthGoals: [] } };

      const quarterlyPlan = quarterlyPlansResponse.data.find(
        (qp) => qp.quarter === quarter
      );
      if (!quarterlyPlan)
        return { Plans: { CurrentMonthGoals: [], NextMonthGoals: [] } };

      const plansResponse = await quarterlyPlan.plan();
      if (!plansResponse?.data)
        return { Plans: { CurrentMonthGoals: [], NextMonthGoals: [] } };

      const plans = sortPlans(
        plansResponse.data.filter((plan) =>
          plan.month?.includes(getMonthName(month))
        )
      );
      const currentMonthGoals = plans.map((plan) => ({
        id: plan.id,
        activity: plan.activity,
        month: getMonthName(month),
        functionalAreaId: plan.functionalAreaId,
        comments: plan.comments,
        isMajorGoal: plan.isMajorGoal,
      }));

      let nextMonthGoals: Goal[] = [];

      if (nextQuarter === quarter && nextYears === years) {
        nextMonthGoals = sortPlans(
          plansResponse.data
            .filter((plan) => plan.month?.includes(getMonthName(nextMonth)))
            .map((plan) => ({
              id: plan.id,
              activity: plan.activity,
              month: getMonthName(nextMonth),
              functionalAreaId: plan.functionalAreaId,
              comments: plan.comments,
              isMajorGoal: plan.isMajorGoal,
            }))
        );
      } else {
        const nextQuarterlyPlan = quarterlyPlansResponse.data.find(
          (qp) => qp.quarter === nextQuarter
        );
        if (nextQuarterlyPlan) {
          const nextPlansResponse = await nextQuarterlyPlan.plan();
          if (nextPlansResponse?.data) {
            nextMonthGoals = sortPlans(
              nextPlansResponse.data
                .filter((plan) => plan.month?.includes(getMonthName(nextMonth)))
                .map((plan) => ({
                  id: plan.id,
                  activity: plan.activity,
                  month: getMonthName(nextMonth),
                  functionalAreaId: plan.functionalAreaId,
                  comments: plan.comments,
                  isMajorGoal: plan.isMajorGoal,
                }))
            );
          }
        }
      }

      console.log("Current Month Goals:", currentMonthGoals);
      console.log("Next Month Goals:", nextMonthGoals);

      return {
        Plans: {
          CurrentMonthGoals: currentMonthGoals,
          NextMonthGoals: nextMonthGoals,
        },
      };
    } catch (error) {
      console.error("Error fetching plans:", error);
      return { Plans: { CurrentMonthGoals: [], NextMonthGoals: [] } };
    }
  };

  const { data, isLoading, error } = useSWR<ApiResponse>(
    condition && projectId && userId
      ? ["api/plans", projectId, userId, month, year]
      : null,
    fetcher,
    { keepPreviousData: true }
  );

  return { plans: data?.Plans || [], isLoading, error };
}
