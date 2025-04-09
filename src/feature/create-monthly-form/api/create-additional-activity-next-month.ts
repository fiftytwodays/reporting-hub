import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

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

export function useSaveAdditionalActivityNextMonth() {
  const client = generateClient<Schema>();

  const saveAdditionalActivityNextMonth = async (
    key: string,
    { arg }: { arg: any }
  ) => {
    const activity = arg.additionalActivityNextMonth;

    console.log("Saving additional activity next month:", activity);
    let plan;

    // Update Plan if ID exists, otherwise create new
    if (activity.id) {
      plan = await client.models.Plan.update({
        id: activity.id,
        quarterlyPlanId: activity.quarterlyPlanId,
        activity: activity.activity,
        month: [getMonthName(activity.month)],
        functionalAreaId: activity.functionalArea,
        comments: activity.comments,
        isMajorGoal: activity.majorGoal,
      });
    } else {
      plan = await client.models.Plan.create({
        quarterlyPlanId: activity.quarterlyPlanId,
        activity: activity.activity,
        month: [getMonthName(activity.month)],
        functionalAreaId: activity.functionalArea,
        comments: activity.comments,
        isMajorGoal: activity.majorGoal,
      });

      if (plan.data?.id && activity.monthlyFormId) {
        const additionalActivityNextMonth =
          await client.models.AdditionalActivityNextMonth.create({
            monthlyFormId: activity.monthlyFormId,
            activityId: plan.data?.id,
          });

        if (!additionalActivityNextMonth?.data) {
          throw new Error("Failed to create AdditionalActivityNextMonth entry");
        }
        return plan.data;
      } else {
        throw new Error("Failed to create or update Plan");
      }
    }

    // Save to AdditionalActivityNextMonth if Plan save succeeded
  };

  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/save-additional-activity-next-month",
    saveAdditionalActivityNextMonth
  );

  return {
    saveAdditionalActivityNextMonth: trigger,
    savedAdditionalActivityNextMonth: data,
    isSavingAdditionalActivityNextMonth: isMutating,
    saveAdditionalActivityNextMonthError: error,
  };
}
