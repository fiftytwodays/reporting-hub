import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface UpdatePlanInput {
  quarterlyPlanId: string,
  activity: string,
  month: string[],
  functionalAreaId: string,
  department: string,
  comments: string,
  id?: string,
}

interface PlanResponse {
  id: string;
  quarterlyPlanId: string,
  activity: string,
  month: string[],
  functionalAreaId: string,
  department: string,
  comments: string,
}

export default function useUpdatePlan() {
  const client = generateClient<Schema>();

  const { data: Plan } = useSWR("api/updatePlan");

  // Function to create a project
  const updatePlan = async (key: string, { arg }: { arg: UpdatePlanInput }) => {
    console.log("Arguements", arg)
    const response = await client.models.Plan.update({
      quarterlyPlanId: arg.quarterlyPlanId,
      activity: arg.activity,
      month: arg.month,
      functionalAreaId: arg.functionalAreaId,
      department: arg.department,
      comments: arg.comments,
      id: arg.id ?? "",
    });
console.log("Response from update Plan", response)
    if (response?.data) {
      const newPlan = {
        id: response.data.id,
        quarterlyPlanId: response.data.quarterlyPlanId,
        activity: response.data.activity,
        month: response.data.month,
        functionalAreaId: response.data.functionalAreaId,
        department: response.data.department,
        comments: response.data.comments,
      } as PlanResponse;

      return newPlan;
    }

    throw new Error("Failed to update the  Plan");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/update-plan", updatePlan);

  return {
    updatePlan: trigger,  // Function to initiate the Plan creation
    updatedPlan: data,    // The created Plan data
    isUpdatingPlan: isMutating,  // Loading state
    updateError: error,      // Error state
  };
}
