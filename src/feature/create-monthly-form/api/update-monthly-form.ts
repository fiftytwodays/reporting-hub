import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

export function useUpdateMonthlyForm() {
  const client = generateClient<Schema>();

  const updateMonthlyForm = async (key: string, { arg }: { arg: any }) => {
    const response = await client.models.MonthlyForm.update({
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

    if (response?.data) {
      return response.data;
    }

    throw new Error("Failed to update the monthly form");
  };

  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/update-monthly-plan",
    updateMonthlyForm
  );

  return {
    updateMonthlyForm: trigger, // Function to initiate the update operation
    updatedMonthlyForm: data, // The updated monthly form data
    isMonthlyFormUpdating: isMutating, // Loading state
    updateMonthlyFormError: error, // Error state
  };
}
