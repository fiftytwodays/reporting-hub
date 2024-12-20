import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface CreateClusterInput {
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

export default function useCreateCluster() {
  const client = generateClient<Schema>();

  const { data: clusters } = useSWR("api/clusters");
  
  // Function to create a cluster
  const createCluster = async (key: string, { arg }: { arg: CreateClusterInput }) => {
    const response = await client.models.Cluster.create({
      name: arg.name,
      regionId: arg.regionId,
      description: arg.description,
    });

    if (response?.data) {
      const newCluster = {
        id: response.data.id,
        name: response.data.name ?? "",
        regionId: response.data.regionId,
        description: response.data.description ?? "",
      } as ClusterResponse;

      return newCluster;
    }

    throw new Error("Failed to create the cluster");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/create-cluster", createCluster);

  return {
    createCluster: trigger,  // Function to initiate the cluster creation
    createdCluster: data,    // The created cluster data
    isCreating: isMutating,  // Loading state
    createError: error,      // Error state
  };
}
