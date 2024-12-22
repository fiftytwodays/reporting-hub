import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

interface EditClusterInput {
  id: string;
  name: string;
  regionId: string;
  description?: string;
}

interface ClusterResponse {
  id: string;
  name: string;
  regionId: string;
  description?: string;
}

export default function useEditCluster() {
  const client = generateClient<Schema>();

  // Function to update a cluster
  const updateCluster = async (key: string, { arg }: { arg: EditClusterInput }) => {

    const response = await client.models.Cluster.update({
      id: arg.id,
      name: arg.name,
      regionId: arg.regionId,
      description: arg.description,
    });

    if (response?.data) {
      return {
        id: response.data.id,
        name: response.data.name ?? "",
        regionId: response.data.regionId,
        description: response.data.description ?? "",
      } as ClusterResponse;
    }
    throw new Error("Failed to update the cluster");
  };

  // Use SWR Mutation to handle the updation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/update-cluster", updateCluster);

  return {
    updateCluster: trigger, // Function to initiate the cluster updation
    updatedCluster: data,  // The updated cluster data
    isUpdating: isMutating, // Loading state
    updateError: error,     // Error state
  };
}
