import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

export function useSaveAdditionalActivity() {
  const client = generateClient<Schema>();

  const saveAdditionalActivity = async (key: string, { arg }: { arg: any }) => {
    let additionalActivity;

    additionalActivity = await client.models.AdditionalActivity.get({
      id: arg.id,
    });

    if (additionalActivity?.data) {
      additionalActivity = await client.models.AdditionalActivity.update({
        id: arg.id,
        monthlyFormId: arg.monthlyFormId,
        activity: arg.activity,
        isMajorGoal: arg.isMajorGoal,
        functionalAreaId: arg.functionalArea,
        comments: arg.comments,
      });
    }
    if (!additionalActivity?.data) {
      const payload = {
        monthlyFormId: arg.monthlyFormId,
        activity: arg.activity,
        isMajorGoal: arg.majorGoal,
        functionalAreaId: arg.functionalArea,
        comments: arg.comments,
      };
      additionalActivity = await client.models.AdditionalActivity.create(
        payload
      );
    }

    if (additionalActivity?.data) {
      return additionalActivity.data;
    }

    throw new Error("Failed to save the additional activity");
  };

  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/save-additional-activity",
    saveAdditionalActivity
  );

  return {
    saveAdditionalActivity: trigger, // Function to initiate the save operation
    savedAdditionalActivity: data, // The saved additional activity data
    isAdditionalActivitySaving: isMutating, // Loading state
    saveAdditionalActivityError: error, // Error state
  };
}
