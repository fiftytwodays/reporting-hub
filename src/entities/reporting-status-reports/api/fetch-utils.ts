import { Plan, YearlyPlan } from "@/shared/config/model";
import type { Schema } from "@root/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Goal } from "../config/types";

interface FetchOptions {
  condition: boolean;
  projectId: string;
  userId: string;
  month: number;
  year: number;
  facilitatorId: string;
}

interface ApiResponse {
  Plans: {
    quarterlyPlanId: string;
    nextMonthGoalsQuarterlyPlanId: string;
    NextMonthGoals: Goal[];
  };
}

// Utility functions
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

// Utility to sort plans (await async items)
async function sortPlans(promises: Promise<Goal>[]): Promise<Goal[]> {
  const results = await Promise.all(promises);
  return results.sort((a, b) =>
    (a.activity ?? "").localeCompare(b.activity ?? "")
  );
}

export async function getOutcomeByMonthlyFormId({
  condition,
  monthlyFormId,
}: {
  condition: boolean;
  monthlyFormId: string;
}): Promise<Goal[] | null> {
  if (!condition || !monthlyFormId) {
    throw new Error("Missing or invalid input parameters.");
  }

  const client = generateClient<Schema>();

  const outcomesResponse =
    await client.models.Outcome.listOutcomeByMonthlyFormId({
      monthlyFormId,
    });

  if (!outcomesResponse?.data?.length) return null;

  const outcomes = await Promise.all(
    outcomesResponse.data.map(async (outcome) => {
      const activity = await client.models.Plan.get({
        id: outcome.activityId ?? "",
      });

      return {
        id: outcome.id ?? "",
        activityId: outcome.activityId ?? "",
        activityName: activity.data?.activity ?? "",
        achieved: outcome.achieved ?? "",
        reason: outcome.reason ?? "",
        comments: outcome.comments ?? "",
        functionalArea: activity.data?.functionalAreaId
          ? (
              await client.models.FunctionalArea.get({
                id: activity.data.functionalAreaId,
              })
            )?.data?.name || "Unknown"
          : "Unknown",
        isMajorGoal: activity.data?.isMajorGoal ? "Yes" : "No",
      };
    })
  );

  return outcomes;
}

export async function getAdditionalActivitiesByMonthlyFormId({
  condition = true,
  monthlyFormId,
}: {
  condition: boolean;
  monthlyFormId: string;
}) {
  if (!condition || !monthlyFormId) {
    throw new Error("Missing or invalid input parameters.");
  }

  const client = generateClient<Schema>();

  try {
    const response =
      await client.models.AdditionalActivity.listAdditionalActivityByMonthlyFormId(
        { monthlyFormId }
      );

    if (!response?.data?.length) return null;

    const additionalActivities = await Promise.all(
      response.data.map(async (activity) => ({
        id: activity.id ?? "",
        monthlyFormId: activity.monthlyFormId ?? "",
        activity: activity.activity ?? "",
        functionalArea: activity.functionalAreaId
          ? (
              await client.models.FunctionalArea.get({
                id: activity.functionalAreaId,
              })
            )?.data?.name || "Unknown"
          : "Unknown",
        comments: activity.comments ?? "",
        isMajorGoal: activity.isMajorGoal ? "Yes" : "No",
      }))
    );

    return additionalActivities;
  } catch (error) {
    console.error("Error fetching additional activities:", error);
    throw error;
  }
}

export async function getAdditionalActivitiesNextMonthByMonthlyFormId({
  condition = true,
  monthlyFormId,
}: {
  condition: boolean;
  monthlyFormId: string;
}) {
  if (!condition || !monthlyFormId) {
    throw new Error("Missing or invalid input parameters.");
  }

  const client = generateClient<Schema>();

  try {
    const response =
      await client.models.AdditionalActivityNextMonth.listAdditionalActivityNextMonthByMonthlyFormId(
        {
          monthlyFormId,
        }
      );

    if (!response?.data?.length) return null;

    const validActivityIds = response.data
      .map((a) => a.activityId)
      .filter((id): id is string => Boolean(id));
    const plansResponses = await Promise.all(
      validActivityIds.map(async (id) => {
        const plan = await client.models.Plan.get({ id });

        const functionalAreaName = plan.data?.functionalAreaId
          ? (
              await client.models.FunctionalArea.get({
                id: plan.data.functionalAreaId,
              })
            )?.data?.name ?? "Unknown"
          : "Unknown";

        return {
          data: {
            ...plan.data,
            functionalArea: functionalAreaName,
            isMajorGoal: plan.data?.isMajorGoal ? "Yes" : "No",
          },
        };
      })
    );

    console.log(
      "Fetched additional activities for next month:",
      plansResponses
    );
    return plansResponses.flatMap((res) => res?.data ?? []);
  } catch (err) {
    console.error("Error fetching additional activities or plans:", err);
    throw err;
  }
}

export async function getPlans({
  condition,
  projectId,
  userId,
  month,
  year,
  facilitatorId,
}: FetchOptions): Promise<ApiResponse> {
  if (!condition || !projectId || !userId) {
    throw new Error("Missing required fetch parameters.");
  }

  const client = generateClient<Schema>();

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const quarter = Math.ceil(month / 3) - 1 === 0 ? 4 : Math.ceil(month / 3) - 1;
  const nextQuarter =
    Math.ceil(nextMonth / 3) - 1 === 0 ? 4 : Math.ceil(nextMonth / 3) - 1;
  const years = getYearString(year, quarter);
  const nextYears = getYearString(nextYear, nextQuarter);

  const monthlyFormResponse =
    await client.models.MonthlyForm.listMonthlyFormByFacilitator({
      facilitator: facilitatorId,
    });

  const currentMonthlyForm = monthlyFormResponse.data.find((monthlyForm) => {
    return (
      monthlyForm.projectId === projectId &&
      Number(monthlyForm.year) === year &&
      Number(monthlyForm.month) === month
    );
  });

  const additionalActivitiesNextMonth =
    await client.models.AdditionalActivityNextMonth.listAdditionalActivityNextMonthByMonthlyFormId(
      {
        monthlyFormId: currentMonthlyForm?.id || "",
      }
    );

  const nextMonthActivitiesId = additionalActivitiesNextMonth.data?.map(
    (activity) => activity.activityId
  );

  const yearlyPlansResponse =
    await client.models.YearlyPlan.listYearlyPlanByUserId({ userId });
  if (!yearlyPlansResponse?.data?.length)
    throw new Error("Yearly plan not found.");

  const yearlyPlan = yearlyPlansResponse.data.find(
    (yp) => yp.year === years && yp.projectId === projectId
  );
  if (!yearlyPlan)
    throw new Error(`Yearly plan not found for project ${projectId}`);

  const quarterlyPlansResponse =
    await client.models.QuarterlyPlan.listQuarterlyPlanByYearlyPlanId({
      yearlyPlanId: yearlyPlan.id,
    });
  if (!quarterlyPlansResponse?.data?.length)
    throw new Error("Quarterly plan not found in the yearly plan.");

  const quarterlyPlan = quarterlyPlansResponse.data.find(
    (qp) => qp.quarter === quarter
  );
  if (!quarterlyPlan || quarterlyPlan.status !== "approved") {
    throw new Error(
      `Quarterly plan for ${getQuarterName(
        quarter
      )} of ${years} is not approved or not found.`
    );
  }

  const plansResponse = await client.models.Plan.listPlanByQuarterlyPlanId({
    quarterlyPlanId: quarterlyPlan.id,
  });
  if (!plansResponse?.data?.length) {
    throw new Error(
      `No plans found for the current month (${getMonthName(month)}).`
    );
  }

  const plans = await sortPlans(
    plansResponse.data
      .filter((plan) => plan.activity)
      .map(async (plan) => ({
        id: plan.id,
        activity: plan.activity,
        month: getMonthName(month),
        functionalArea: plan.functionalAreaId
          ? (
              await client.models.FunctionalArea.get({
                id: plan.functionalAreaId,
              })
            )?.data?.name || "Unknown"
          : "Unknown",
        comments: plan.comments,
        isMajorGoal: plan.isMajorGoal ? "Yes" : "No",
      }))
  );
  console.log("Current month goals:", plans);

  let nextMonthGoals: Goal[] = [];
  let nextMonthGoalsQuarterlyPlanId = "";

  if (nextQuarter === quarter && nextYears === years) {
    nextMonthGoalsQuarterlyPlanId = quarterlyPlan.id;
    nextMonthGoals = await sortPlans(
      plansResponse.data
        .filter(
          (plan) =>
            plan.month?.includes(getMonthName(nextMonth)) &&
            !nextMonthActivitiesId?.includes(plan.id)
        )
        .map(async (plan) => ({
          id: plan.id,
          activity: plan.activity,
          month: getMonthName(nextMonth),
          functionalArea: plan.functionalAreaId
            ? (
                await client.models.FunctionalArea.get({
                  id: plan.functionalAreaId,
                })
              )?.data?.name || "Unknown"
            : "Unknown",
          comments: plan.comments,
          isMajorGoal: plan.isMajorGoal ? "Yes" : "No",
        }))
    );
    console.log("Next month goals:", nextMonthGoals);
  } else if (nextYears === years) {
    const nextQuarterlyPlan = quarterlyPlansResponse.data.find(
      (qp) => qp.quarter === nextQuarter
    );
    if (!nextQuarterlyPlan || nextQuarterlyPlan.status !== "approved") {
      throw new Error(
        `Next quarterly plan for ${getQuarterName(
          nextQuarter
        )} of ${nextYears} is not approved.`
      );
    }

    nextMonthGoalsQuarterlyPlanId = nextQuarterlyPlan.id;
    const nextPlansResponse =
      await client.models.Plan.listPlanByQuarterlyPlanId({
        quarterlyPlanId: nextQuarterlyPlan.id,
      });
    console.log("Next plans response:", nextPlansResponse);
    if (nextPlansResponse?.data?.length) {
      nextMonthGoals = await sortPlans(
        nextPlansResponse.data
          .filter(
            (plan) =>
              plan.month?.includes(getMonthName(nextMonth)) &&
              !nextMonthActivitiesId?.includes(plan.id)
          )
          .map(async (plan) => ({
            id: plan.id,
            activity: plan.activity,
            month: getMonthName(nextMonth),
            functionalArea: plan.functionalAreaId
              ? (
                  await client.models.FunctionalArea.get({
                    id: plan.functionalAreaId,
                  })
                )?.data?.name || "Unknown"
              : "Unknown",
            comments: plan.comments,
            isMajorGoal: plan.isMajorGoal ? "Yes" : "No",
          }))
      );
    }
  } else {
    const yearlyPlan = yearlyPlansResponse.data.find(
      (yp) => yp.year === nextYears && yp.projectId === projectId
    );
    if (!yearlyPlan) {
      throw new Error(
        `Yearly plan not found for project ${projectId}, ${nextYears}`
      );
    }
    const quarterlyPlansResponse =
      await client.models.QuarterlyPlan.listQuarterlyPlanByYearlyPlanId({
        yearlyPlanId: yearlyPlan.id,
      });
    const nextQuarterlyPlan = quarterlyPlansResponse.data.find(
      (qp) => qp.quarter === nextQuarter
    );
    if (!nextQuarterlyPlan || nextQuarterlyPlan.status !== "approved") {
      throw new Error(
        `Next quarterly plan for ${getQuarterName(
          nextQuarter
        )} of ${nextYears} is not approved.`
      );
    }

    nextMonthGoalsQuarterlyPlanId = nextQuarterlyPlan.id;
    const nextPlansResponse =
      await client.models.Plan.listPlanByQuarterlyPlanId({
        quarterlyPlanId: nextQuarterlyPlan.id,
      });
    console.log("Next plans response:", nextPlansResponse);
    if (nextPlansResponse?.data?.length) {
      nextMonthGoals = await sortPlans(
        nextPlansResponse.data
          .filter(
            (plan) =>
              plan.month?.includes(getMonthName(nextMonth)) &&
              !nextMonthActivitiesId?.includes(plan.id)
          )
          .map(async (plan) => ({
            id: plan.id,
            activity: plan.activity,
            month: getMonthName(nextMonth),
            functionalArea: plan.functionalAreaId
              ? (
                  await client.models.FunctionalArea.get({
                    id: plan.functionalAreaId,
                  })
                )?.data?.name || "Unknown"
              : "Unknown",
            comments: plan.comments,
            isMajorGoal: plan.isMajorGoal ? "Yes" : "No",
          }))
      );
    }
  }

  return {
    Plans: {
      quarterlyPlanId: quarterlyPlan.id,
      nextMonthGoalsQuarterlyPlanId,
      NextMonthGoals: nextMonthGoals,
    },
  };
}
