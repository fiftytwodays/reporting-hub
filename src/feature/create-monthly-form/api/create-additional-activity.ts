import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

export function useSaveAdditionalActivity() {
  const client = generateClient<Schema>();

  const saveAdditionalActivity = async (key: string, { arg }: { arg: any }) => {
    let additionalActivity;
    console.log("Saving additional activity:", arg);

    additionalActivity = await client.models.AdditionalActivity.get({
      id: arg.id,
    });

    console.log("Additional activity fetched:", additionalActivity);

    if (additionalActivity?.data) {
      additionalActivity = await client.models.AdditionalActivity.update({
        id: arg.id,
        monthlyFormId: arg.monthlyFormId,
        activity: arg.activity,
        isMajorGoal: arg.isMajorGoal,
        functionalAreaId: arg.functionalAreaId,
        comments: arg.comments,
      });
      console.log("Additional activity updated:", additionalActivity);
    }
    if (!additionalActivity?.data) {
      console.log("Additional activity not found, creating a new one", arg);
      const payload = {
        monthlyFormId: arg.monthlyFormId,
        activity: arg.activity,
        isMajorGoal: arg.majorGoal,
        functionalAreaId: arg.functionalAreaId,
        comments: arg.comments,
      };
      console.log("Payload for creating additional activity:", payload);
      additionalActivity = await client.models.AdditionalActivity.create(
        payload
      );
      console.log("Additional activity created:", additionalActivity);
    }

    console.log("Additional activity saved:", additionalActivity);
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
