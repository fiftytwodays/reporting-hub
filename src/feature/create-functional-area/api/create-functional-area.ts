import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface CreateFunctionalAreaInput {
  name: string;
  description?: string;
}

interface FunctionalAreaResponse {
  id: string;
  description?: string;
}

export default function useCreateFunctionalArea() {
  const client = generateClient<Schema>();

  const { data: functionalAreas } = useSWR("api/functional-areas");
  
  const createFunctionalArea = async (key: string, { arg }: { arg: CreateFunctionalAreaInput }) => {
    const response = await client.models.FunctionalArea.create({
      name: arg.name,
      description: arg.description,
    });

    if (response?.data) {
      const newFunctionalArea = {
        id: response.data.id,
        name: response.data.name ?? "",
        description: response.data.description ?? "",
      } as FunctionalAreaResponse;

      return newFunctionalArea;
    }

    throw new Error("Failed to create the functional area");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/create-functional-area", createFunctionalArea);

  return {
    createFunctionalArea: trigger,  // Function to initiate the functional area creation
    createdFunctionalArea: data,    // The created functional area data
    isCreating: isMutating,  // Loading state
    createError: error,      // Error state
  };
}
