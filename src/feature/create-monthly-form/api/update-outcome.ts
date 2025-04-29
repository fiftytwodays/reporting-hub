import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import { Nullable } from "@aws-amplify/data-schema";

export function useUpdateOutcomes() {
  const client = generateClient<Schema>();

  const updateOutcomes = async (key: string, { arg }: { arg: any }) => {
    const outcomes = arg || []; // Directly use the provided outcomes payload

    const response = await Promise.all(
      outcomes.map(
        (outcome: {
          id: string; // ID is required for updating
          comments?: Nullable<string> | undefined;
          activityId?: string | undefined;
          monthlyFormId?: string | undefined;
          reason?: Nullable<string> | undefined;
          achieved?: Nullable<string> | undefined;
        }) => client.models.Outcome.update(outcome)
      )
    );

    if (response.every((res) => res?.data)) {
      return response.map((res) => res.data);
    }

    throw new Error("Failed to update the outcomes");
  };

  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/update-outcomes",
    updateOutcomes
  );

  return {
    updateOutcomes: trigger, // Function to initiate the update operation
    updatedOutcomes: data, // The updated outcomes data
    isOutcomesUpdating: isMutating, // Loading state
    updateOutcomesError: error, // Error state
  };
}
