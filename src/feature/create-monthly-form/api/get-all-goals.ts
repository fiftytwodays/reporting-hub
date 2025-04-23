import { Plan, YearlyPlan } from "@/shared/config/model";
import type { Schema } from "@root/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { Goal } from "../config/monthly-form";
import next from "next";
import { act } from "react";

interface FetchOptions {
  condition: boolean;
  projectId: string;
  userId: string;
  month: number;
  year: number;
  action: string;
}

interface ApiResponse {
  Plans: {
    quarterlyPlanId: string;
    nextMonthGoalsQuarterlyPlanId: string;
    CurrentMonthGoals: Goal[];
    NextMonthGoals: Goal[];
  };
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

const quarterNames = ["Apr - Jun", "Jul - Sept", "Oct - Dec", "Jan - Mar"];

const getMonthName = (month: number) =>
  monthNames[month - 1] || "Invalid month";

const getQuarterName = (quarter: number) =>
  quarterNames[quarter - 1] || "Invalid quarter";

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
  action,
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

      const monthlyFormResponse =
        await client.models.MonthlyForm.listMonthlyFormByFacilitator({
          facilitator: userId,
        });

      if (monthlyFormResponse.data) {
        const response = monthlyFormResponse.data;
        response.forEach((monthlyForm) => {
          if (
            monthlyForm.projectId === projectId &&
            Number(monthlyForm.year) === year &&
            Number(monthlyForm.month) === month &&
            action === "create"
          ) {
            throw new Error(
              `A monthly plan already exists for project ${projectId} in month ${getMonthName(
                month
              )}, ${year}.`
            );
          }
        });
      }

      // Fetch yearly plans
      const yearlyPlansResponse =
        await client.models.YearlyPlan.listYearlyPlanByUserId({ userId });
      if (!yearlyPlansResponse?.data || yearlyPlansResponse.data.length === 0) {
        throw new Error("Yearly plan not found.");
      }

      // Find the specific yearly plan
      const yearlyPlan = yearlyPlansResponse.data.find(
        (yp) => yp.year === years && yp.projectId === projectId
      );
      if (!yearlyPlan) {
        throw new Error(`Yearly plan not found for project ${projectId}`);
      }

      // Fetch quarterly plans
      const quarterlyPlansResponse = await yearlyPlan.quarterlyPlan();
      if (
        !quarterlyPlansResponse?.data ||
        quarterlyPlansResponse.data.length === 0
      ) {
        throw new Error("Quarterly plan not found in the yearly plan.");
      }

      // Find the specific quarterly plan
      const quarterlyPlan = quarterlyPlansResponse.data.find(
        (qp) => qp.quarter === quarter
      );
      if (!quarterlyPlan) {
        throw new Error(
          `Quarterly plan not found for quarter ${getQuarterName(
            quarter
          )} of ${years}.`
        );
      }

      // Check if the quarterly plan is approved
      if (quarterlyPlan.status !== "approved") {
        throw new Error(
          `The quarterly plan for quarter ${getQuarterName(
            quarter
          )} of ${years} is not approved.`
        );
      }

      // Fetch plans for the current month
      const plansResponse = await quarterlyPlan.plan();
      if (!plansResponse?.data || plansResponse.data.length === 0) {
        throw new Error(
          `No plans found for the current month (${getMonthName(month)}).`
        );
      }

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

      // Fetch plans for the next month
      let nextMonthGoals: Goal[] = [];
      let nextMonthGoalsQuarterlyPlanId = "";

      if (nextQuarter === quarter && nextYears === years) {
        nextMonthGoalsQuarterlyPlanId = quarterlyPlan.id;
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
        if (nextQuarterlyPlan?.status !== "approved") {
          throw new Error(
            `The quarterly plan for next quarter ${getQuarterName(
              quarter
            )} of ${years} is not approved.`
          );
        }
        if (nextQuarterlyPlan) {
          nextMonthGoalsQuarterlyPlanId = nextQuarterlyPlan.id;
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

      return {
        Plans: {
          quarterlyPlanId: quarterlyPlan.id,
          nextMonthGoalsQuarterlyPlanId: nextMonthGoalsQuarterlyPlanId,
          CurrentMonthGoals: currentMonthGoals,
          NextMonthGoals: nextMonthGoals,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching plans:", error.message);
      } else {
        console.error("Error fetching plans:", error);
      }
      throw error; // Propagate the error to useSWR
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
