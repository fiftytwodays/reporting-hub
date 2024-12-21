import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

interface deleteFunctionalAreaInput {
  id: string;
}

interface FunctionalAreaResponse {
  id: string;
  name: string;
  description?: string;
}

export default function useDeleteFunctionalArea() {
  const client = generateClient<Schema>();

  const deleteFunctionalArea = async (key: string, { arg }: { arg: deleteFunctionalAreaInput }) => {

    const response = await client.models.FunctionalArea.delete({id: arg.id});

    if (response?.data) {
      return {
        id: response.data.id,
        name: response.data.name ?? "",
        description: response.data.description ?? "",
      } as FunctionalAreaResponse;
    }
    else{
    throw new Error("Failed to delete the functional area");
    }
  };

  const { trigger, data, isMutating, error } = useSWRMutation("api/delete-functional-area", deleteFunctionalArea);

  return {
    deleteFunctionalArea: trigger, // Function to initiate the functional area deletion
    deletedFunctionalArea: data,  // The deleted functional area data
    isDeleting: isMutating, // Loading state
    deleteError: error,     // Error state
  };
}
