import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

interface DeleteYearlyFormInput {
  id: string;
}

interface DeleteYearlyFormResponse {
  id: string;
}

export default function useDeleteYearlyForm() {
  const client = generateClient<Schema>();

  const deleteYearlyForm = async (key: string, { arg }: { arg: DeleteYearlyFormInput }) => {

    const response = await client.models.YearlyPlan.delete({id: arg.id});

    if (response?.data) {
      return {
        id: response.data.id,
      } as DeleteYearlyFormResponse;
    }
    else{
    throw new Error("Failed to delete the Yearly Plan");
    }
  };

  const { trigger, data, isMutating, error } = useSWRMutation("api/delete-yearly-form", deleteYearlyForm);

  return {
    deleteYearlyForm: trigger, // Function to initiate the region deletion
    deletedYearlyForm: data,  // The deleted region data
    isDeleting: isMutating, // Loading state
    deleteError: error,     // Error state
  };
}
