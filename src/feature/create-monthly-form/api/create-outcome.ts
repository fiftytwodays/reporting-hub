import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import { Nullable } from "@aws-amplify/data-schema";
import { argv } from "node:process";

export function useSaveOutcomes() {
  const client = generateClient<Schema>();

  const saveOutcome = async (key: string, { arg }: { arg: any }) => {
    let outcome;
    console.log("Saving outcome:", arg);

    outcome = await client.models.Outcome.get({
      id: arg.id,
    });

    console.log("Outcome fetched:", outcome);
    if (outcome?.data) {
      outcome = await client.models.Outcome.update({
        id: arg.id,
        comments: arg.comments,
        activityId: arg.activityId,
        monthlyFormId: arg.monthlyFormId,
        reason: arg.reason,
        achieved: arg.achieved,
      });
      console.log("Outcome fetched inside update:", outcome);
    }
    if (!outcome?.data) {
      console.log("Outcome not found, creating a new one", arg);
      const payload = {
        comments: arg.comments,
        activityId: arg.activityId,
        monthlyFormId: arg.monthlyFormId,
        reason: arg.reason,
        achieved: arg.achieved,
      };
      console.log("Payload for creating outcome:", payload); 
      outcome = await client.models.Outcome.create(payload);
      console.log("Outcome fetched inside create:", outcome);
    }

    console.log("Outcome saved:", outcome);
    if (outcome?.data) {
      return outcome.data;
    }

    throw new Error("Failed to save the monthly form");
  };

  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/save-outcomes",
    saveOutcome
  );

  return {
    saveOutcome: trigger, // Function to initiate the save operation
    savedOutcomes: data, // The saved outcomes data
    isOutcomesSaving: isMutating, // Loading state
    saveOutcomesError: error, // Error state
  };
}
