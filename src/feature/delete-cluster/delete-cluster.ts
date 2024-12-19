import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

interface deleteClusterInput {
  id: string;
}

interface ClusterResponse {
  id: string;
  name: string;
  regionId: string;
  description?: string;
}

export default function useDeleteCluster() {
  const client = generateClient<Schema>();

  // Function to create a cluster
  const deleteCluster = async (key: string, { arg }: { arg: deleteClusterInput }) => {

    const response = await client.models.Cluster.delete({id: arg.id});

    if (response?.data) {
      return {
        id: response.data.id,
        name: response.data.name ?? "",
        regionId: response.data.regionId,
        description: response.data.description ?? "",
      } as ClusterResponse;
    }
    else{
    throw new Error("Failed to delete the cluster");
    }
  };

  const { trigger, data, isMutating, error } = useSWRMutation("api/delete-cluster", deleteCluster);

  return {
    deleteCluster: trigger, // Function to initiate the cluster deletion
    deletedCluster: data,  // The deleted cluster data
    isDeleting: isMutating, // Loading state
    deleteError: error,     // Error state
  };
}
