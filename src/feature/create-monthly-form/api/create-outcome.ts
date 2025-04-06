import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import { Nullable } from "@aws-amplify/data-schema";
import { argv } from "node:process";

export function useSaveOutcomes() {
  const client = generateClient<Schema>();

  const saveOutcome = async (key: string, { arg }: { arg: any }) => {
    let outcome;

    outcome = await client.models.Outcome.get({
      id: arg.id,
    });

    if (outcome?.data) {
      outcome = await client.models.Outcome.update({
        id: arg.id,
        comments: arg.comments,
        activityId: arg.activityId,
        monthlyFormId: arg.monthlyFormId,
        reason: arg.reason,
        achieved: arg.achieved,
      });
    }
    if (!outcome?.data) {
      const payload = {
        comments: arg.comments,
        activityId: arg.activityId,
        monthlyFormId: arg.monthlyFormId,
        reason: arg.reason,
        achieved: arg.achieved,
      };
      outcome = await client.models.Outcome.create(payload);
    }

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
