import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

interface EditFunctionalAreaInput {
  id: string;
  name: string;
  description?: string;
}

interface FunctionalAreaResponse {
  id: string;
  name: string;
  description?: string;
}

export default function useEditFunctionalArea() {
  const client = generateClient<Schema>();

  // Function to update a functional area
  const updateFunctionalArea = async (key: string, { arg }: { arg: EditFunctionalAreaInput }) => {

    const response = await client.models.FunctionalArea.update({
      id: arg.id,
      name: arg.name,
      description: arg.description,
    });

    if (response?.data) {
      return {
        id: response.data.id,
        name: response.data.name ?? "",
        description: response.data.description ?? "",
      } as FunctionalAreaResponse;
    }
    throw new Error("Failed to update the functional area");
  };

  // Use SWR Mutation to handle the updation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/update-functional-area", updateFunctionalArea);

  return {
    updateFunctionalArea: trigger, // Function to initiate the functional area updation
    updatedFunctionalArea: data,  // The updated functional area data
    isUpdating: isMutating, // Loading state
    updateError: error,     // Error state
  };
}
