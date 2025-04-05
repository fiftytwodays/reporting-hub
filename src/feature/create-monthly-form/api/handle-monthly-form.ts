import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

export function useSaveMonthlyForm() {
  const client = generateClient<Schema>();

  const saveMonthlyForm = async (key: string, { arg }: { arg: any }) => {
    let monthlyForm;

    console.log("Saving monthly form:", arg);
    monthlyForm = await client.models.MonthlyForm.get({
      id: arg.id,
    });

    console.log("MonthlyForm fetched:", monthlyForm);

    if (monthlyForm?.data) {
      monthlyForm = await client.models.MonthlyForm.update({
        id: arg.id,
        projectId: arg.projectId,
        month: arg.month,
        year: arg.year,
        status: arg.status,
        facilitator: arg.facilitator,
        praisePoints: arg.praisePoints,
        prayerRequests: arg.prayerRequests,
        story: arg.story,
        concerns: arg.concerns,
        comments: arg.comments,
      });
    }
    if (!monthlyForm?.data) {
      monthlyForm = await client.models.MonthlyForm.create({
        projectId: arg.projectId,
        month: arg.month,
        year: arg.year,
        status: arg.status,
        facilitator: arg.facilitator,
        praisePoints: arg.praisePoints,
        prayerRequests: arg.prayerRequests,
        story: arg.story,
        concerns: arg.concerns,
        comments: arg.comments,
      });
    }

    console.log("MonthlyForm saved:", monthlyForm);
    if (monthlyForm?.data) {
      return monthlyForm.data;
    }

    throw new Error("Failed to save the monthly form");
  };

  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/save-monthly-form",
    saveMonthlyForm
  );

  return {
    saveMonthlyForm: trigger, // Function to initiate the save operation
    savedMonthlyForm: data, // The saved monthly form data
    isMonthlyFormSaving: isMutating, // Loading state
    saveMonthlyFormError: error, // Error state
  };
}
