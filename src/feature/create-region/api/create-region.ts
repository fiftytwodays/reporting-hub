import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface CreateRegionInput {
  name: string;
  description?: string;
}

interface RegionResponse {
  id: string;
  description?: string;
}

export default function useCreateRegion() {
  const client = generateClient<Schema>();

  const { data: regions } = useSWR("api/regions");
  
  // Function to create a project
  const createRegion = async (key: string, { arg }: { arg: CreateRegionInput }) => {
    const response = await client.models.Region.create({
      name: arg.name,
      description: arg.description,
    });

    if (response?.data) {
      const newRegion = {
        id: response.data.id,
        name: response.data.name ?? "",
        description: response.data.description ?? "",
      } as RegionResponse;

      return newRegion;
    }

    throw new Error("Failed to create the region");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/create-region", createRegion);

  return {
    createRegion: trigger,  // Function to initiate the region creation
    createdRegion: data,    // The created region data
    isCreating: isMutating,  // Loading state
    createError: error,      // Error state
  };
}
