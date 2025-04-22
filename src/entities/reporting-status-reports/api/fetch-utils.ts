import { Plan, YearlyPlan } from "@/shared/config/model";
import type { Schema } from "@root/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import next from "next";
import { Goal } from "../config/types";

interface FetchOptions {
  condition: boolean;
  projectId: string;
  userId: string;
  month: number;
  year: number;
}

interface ApiResponse {
  Plans: {
    quarterlyPlanId: string;
    nextMonthGoalsQuarterlyPlanId: string;
    NextMonthGoals: Goal[];
  };
}

// export const fetchOutcomeByMonthlyFormId = async (monthlyFormId: string) => {
//   const response = await getOutcomeByMonthlyFormId({
//     condition: true,
//     monthlyFormId,
//   });

//   console.log("outcomes", response?.outcomes);
//   return response?.outcomes ?? [];
// };

// export const fetchAdditionalActivitiesByMonthlyFormId = async (
//   monthlyFormId: string
// ) => {
//   const response = await getAdditionalActivitiesByMonthlyFormId({
//     condition: true,
//     monthlyFormId,
//   });

//   return response?.additionalActivities ?? [];
// };

// export const fetchAdditionalActivitiesNextMonthByMonthlyFormId = async (
//   monthlyFormId: string
// ) => {
//   const response = await getAdditionalActivitiesNextMonthByMonthlyFormId({
//     condition: true,
//     monthlyFormId,
//   });

//   return response?.additionalActivitiesNextMonth ?? [];
// };

export async function getPlans({
  condition,
  projectId,
  userId,
  month,
  year,
}: {
  condition: boolean;
  projectId: string;
  userId: string;
  month: number;
  year: number;
}): Promise<ApiResponse> {
  if (!condition || !projectId || !userId) {
    throw new Error("Missing required fetch parameters.");
  }

  console.log(
    "Fetching plans with parameters:",
    `condition: ${condition}, projectId: ${projectId}, userId: ${userId}, month: ${month}, year: ${year}`
  );
  const client = generateClient<Schema>();

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

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  const quarter = Math.ceil(month / 3) - 1 === 0 ? 4 : Math.ceil(month / 3) - 1;
  const nextQuarter =
    Math.ceil(nextMonth / 3) - 1 === 0 ? 4 : Math.ceil(nextMonth / 3) - 1;
  const years = getYearString(year, quarter);
  const nextYears = getYearString(nextYear, nextQuarter);

  const monthlyFormResponse =
    await client.models.MonthlyForm.listMonthlyFormByFacilitator({
      facilitator: userId,
    });

  // if (monthlyFormResponse.data) {
  //   const response = monthlyFormResponse.data;
  //   response.forEach((monthlyForm) => {
  //     if (
  //       monthlyForm.projectId === projectId &&
  //       Number(monthlyForm.year) === year &&
  //       Number(monthlyForm.month) === month
  //     ) {
  //       throw new Error(
  //         `A monthly plan already exists for project ${projectId} in month ${getMonthName(
  //           month
  //         )}, ${year}.`
  //       );
  //     }
  //   });
  // }

  const yearlyPlansResponse =
    await client.models.YearlyPlan.listYearlyPlanByUserId({ userId });
  if (!yearlyPlansResponse?.data || yearlyPlansResponse.data.length === 0) {
    throw new Error("Yearly plan not found.");
  }

  const yearlyPlan = yearlyPlansResponse.data.find(
    (yp) => yp.year === years && yp.projectId === projectId
  );
  if (!yearlyPlan) {
    throw new Error(`Yearly plan not found for project ${projectId}`);
  }

  const quarterlyPlansResponse = await yearlyPlan.quarterlyPlan();
  if (
    !quarterlyPlansResponse?.data ||
    quarterlyPlansResponse.data.length === 0
  ) {
    throw new Error("Quarterly plan not found in the yearly plan.");
  }

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

  if (quarterlyPlan.status !== "approved") {
    throw new Error(
      `The quarterly plan for quarter ${getQuarterName(
        quarter
      )} of ${years} is not approved.`
    );
  }

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

  let nextMonthGoals: Goal[] = [];
  let nextMonthGoalsQuarterlyPlanId = "";

  if (nextQuarter === quarter && nextYears === years) {
    nextMonthGoalsQuarterlyPlanId = quarterlyPlan.id;
    nextMonthGoals = sortPlans(
      await Promise.all(
        plansResponse.data
          .filter((plan) => plan.month?.includes(getMonthName(nextMonth)))
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
            isMajorGoal: plan.isMajorGoal,
          }))
      )
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
          await Promise.all(
            nextPlansResponse.data
              .filter((plan) => plan.month?.includes(getMonthName(nextMonth)))
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
                isMajorGoal: plan.isMajorGoal,
              }))
          )
        );
      }
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
