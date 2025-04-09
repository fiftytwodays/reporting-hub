import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import { Goal } from "../config/monthly-form";

type DeleteAdditionalActivityNextMonthArgs = {
  id: string;
  additionalActivitiesNextMonth: Goal[];
};

export function useDeleteAdditionalActivityNextMonth() {
  const client = generateClient<Schema>();

  const deleteAdditionalActivityNextMonth = async (
    key: string,
    { arg }: { arg: DeleteAdditionalActivityNextMonthArgs }
  ): Promise<{ success: boolean }> => {
    const { id, additionalActivitiesNextMonth } = arg;

    const additionalActivityNextMonthIds = additionalActivitiesNextMonth.map(
      (activity) => activity.id
    );

    const response =
      await client.models.AdditionalActivityNextMonth.listAdditionalActivityNextMonthByMonthlyFormId(
        {
          monthlyFormId: id,
        }
      );

    if (response?.data) {
      const deletions = response.data
        .filter(
          (activity) => !additionalActivityNextMonthIds.includes(activity.id)
        )
        .map((activity) =>
          Promise.all([
            client.models.AdditionalActivityNextMonth.delete({
              id: activity.id,
            }),
            client.models.Plan.delete({ id: activity.id }),
          ])
        );

      await Promise.all(deletions);
    }

    return { success: true };
  };

  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/delete-additional-activities-next-month",
    deleteAdditionalActivityNextMonth
  );

  return {
    deleteAdditionalActivityNextMonth: (
      id: string,
      additionalActivitiesNextMonth: Goal[]
    ) => trigger({ id, additionalActivitiesNextMonth }),
    deletedMonthlyForm: data,
    isMonthlyFormDeleting: isMutating,
    deleteMonthlyFormError: error,
  };
}
