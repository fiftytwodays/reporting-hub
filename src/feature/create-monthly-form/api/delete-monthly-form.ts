import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

export function useDeleteMonthlyForm() {
  const client = generateClient<Schema>();

  const deleteMonthlyForm = async (
    key: string,
    { arg }: { arg: { id: string } }
  ) => {
    const response = await client.models.MonthlyForm.delete({
      id: arg.id,
    });

    if (response?.data) {
      return response.data;
    }

    throw new Error("Failed to delete the monthly form");
  };

  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/delete-monthly-form",
    deleteMonthlyForm
  );

  return {
    deleteMonthlyForm: trigger, // Function to initiate the delete operation
    deletedMonthlyForm: data, // The deleted monthly form data
    isMonthlyFormDeleting: isMutating, // Loading state
    deleteMonthlyFormError: error, // Error state
  };
}
