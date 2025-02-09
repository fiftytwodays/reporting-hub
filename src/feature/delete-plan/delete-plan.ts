import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

interface DeletePlanInput {
  ids: string[];
}

interface PlanResponse {
  id: string;
}

export default function useDeletePlan() {
  const client = generateClient<Schema>();

  // Function to create a cluster
  const deletePlan = async (key: string, { arg }: { arg: DeletePlanInput }) => {
    try {
      await Promise.all(arg.ids.map(id => client.models.Plan.delete({id: id})));
      console.log("Successfully deleted all plans");
  } catch (error) {
      console.error("Error deleting plans:", error);
  }
    
console.log("deletePlan", deletePlan);
    // if (deletePlan) {
    //   return {
    //     id: response.data.id,
    //   } as PlanResponse;
    // }
    // else{
    // throw new Error("Failed to delete the plan");
    // }
  };

  const { trigger, data, isMutating, error } = useSWRMutation("api/delete-plan", deletePlan);

  return {
    deletePlan: trigger, // Function to initiate the cluster deletion
    deletedPlan: data,  // The deleted cluster data
    isDeleting: isMutating, // Loading state
    deleteError: error,     // Error state
  };
}
