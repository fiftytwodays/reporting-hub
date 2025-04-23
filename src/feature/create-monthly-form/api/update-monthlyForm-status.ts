import type { Schema } from "@root/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import useSWRMutation from "swr/mutation";

interface FetchOptions {
  condition: boolean;
  monthlyFormId: string;
  status: string;
  comment?: string;
}

export default function useUpdateStatus() {
  const client = generateClient<Schema>();

  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/update-monthlyForm-status",
    async (key: string, { arg }: { arg: FetchOptions }) => {
      const { condition, monthlyFormId, status, comment } = arg;
      if (!condition) {
        throw new Error("Condition not met for updating status");
      }

      const response = await client.models.MonthlyForm.get({
        id: monthlyFormId,
      });

      if (!response || response.errors) {
        throw new Error("Failed to fetch monthly form");
      }
      const monthlyForm = response.data;
      if (monthlyForm) {
        const updatedMonthlyForm = await client.models.MonthlyForm.update({
          id: monthlyFormId,
          projectId: monthlyForm.projectId,
          month: monthlyForm.month,
          year: monthlyForm.year,
          status: status,
          facilitator: monthlyForm.facilitator,
          praisePoints: monthlyForm.praisePoints,
          prayerRequests: monthlyForm.prayerRequests,
          story: monthlyForm.story,
          concerns: monthlyForm.concerns,
          comments: comment ?? monthlyForm.comments,
        });
        if (!updatedMonthlyForm || updatedMonthlyForm.errors) {
          throw new Error("Failed to update monthly form");
        }
        return updatedMonthlyForm.data;
      }

      if (!response || response.errors) {
        throw new Error("Failed to update monthly form status");
      }
      throw new Error("Failed to update monthly form status");
    }
  );

  return {
    updateStatus: trigger, // Function to initiate the update operation
    updatedStatus: data, // The updated status data
    isStatusUpdating: isMutating, // Loading state
    updateStatusError: error, // Error state
  };
}
