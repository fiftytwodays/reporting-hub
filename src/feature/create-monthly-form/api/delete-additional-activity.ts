import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import { Goal } from "../config/monthly-form";

type DeleteAdditionalActivityArgs = {
  id: string;
  additionalActivities: Goal[];
};

export function useDeleteAdditionalActivity() {
  const client = generateClient<Schema>();

  const deleteAdditionalActivity = async (
    key: string,
    { arg }: { arg: DeleteAdditionalActivityArgs }
  ): Promise<{ success: boolean }> => {
    const { id, additionalActivities } = arg;

    const additionalActivityIds = additionalActivities.map(
      (activity) => activity.id
    );

    const response =
      await client.models.AdditionalActivity.listAdditionalActivityByMonthlyFormId(
        {
          monthlyFormId: id,
        }
      );

    if (response?.data) {
      const deletions = response.data
        .filter((activity) => !additionalActivityIds.includes(activity.id))
        .map((activity) =>
          client.models.AdditionalActivity.delete({ id: activity.id })
        );

      await Promise.all(deletions);
    }

    return { success: true };
  };

  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/delete-additional-activities",
    deleteAdditionalActivity
  );

  return {
    deleteAdditionalActivity: (id: string, additionalActivities: Goal[]) =>
      trigger({ id, additionalActivities }),
    deletedMonthlyForm: data,
    isMonthlyFormDeleting: isMutating,
    deleteMonthlyFormError: error,
  };
}
