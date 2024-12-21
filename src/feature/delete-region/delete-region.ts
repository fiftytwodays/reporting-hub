import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

interface deleteRegionInput {
  id: string;
}

interface RegionResponse {
  id: string;
  name: string;
  description?: string;
}

export default function useDeleteRegion() {
  const client = generateClient<Schema>();

  const deleteRegion = async (key: string, { arg }: { arg: deleteRegionInput }) => {

    const response = await client.models.Region.delete({id: arg.id});

    if (response?.data) {
      return {
        id: response.data.id,
        name: response.data.name ?? "",
        description: response.data.description ?? "",
      } as RegionResponse;
    }
    else{
    throw new Error("Failed to delete the region");
    }
  };

  const { trigger, data, isMutating, error } = useSWRMutation("api/delete-region", deleteRegion);

  return {
    deleteRegion: trigger, // Function to initiate the region deletion
    deletedRegion: data,  // The deleted region data
    isDeleting: isMutating, // Loading state
    deleteError: error,     // Error state
  };
}
