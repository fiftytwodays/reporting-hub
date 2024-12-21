import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

interface EditRegionInput {
  id: string;
  name: string;
  description?: string;
}

interface RegionResponse {
  id: string;
  name: string;
  description?: string;
}

export default function useEditRegion() {
  const client = generateClient<Schema>();

  // Function to update a region
  const updateRegion = async (key: string, { arg }: { arg: EditRegionInput }) => {

    const response = await client.models.Region.update({
      id: arg.id,
      name: arg.name,
      description: arg.description,
    });

    if (response?.data) {
      return {
        id: response.data.id,
        name: response.data.name ?? "",
        description: response.data.description ?? "",
      } as RegionResponse;
    }
    throw new Error("Failed to update the region");
  };

  // Use SWR Mutation to handle the updation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/update-region", updateRegion);

  return {
    updateRegion: trigger, // Function to initiate the region updation
    updatedRegion: data,  // The updated region data
    isUpdating: isMutating, // Loading state
    updateError: error,     // Error state
  };
}
