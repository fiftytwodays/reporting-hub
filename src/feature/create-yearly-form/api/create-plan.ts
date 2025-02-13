import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface CreatePlanInput {
  quarterlyPlanId: string,
  activity: string,
  month: string[],
  functionalAreaId: string,
  comments: string,
  isMajorGoal: boolean,
}

interface PlanResponse {
  id: string;
  quarterlyPlanId: string,
  activity: string,
  month: string[],
  functionalAreaId: string,
  comments: string,
  isMajorGoal: boolean,
}

export default function useCreatePlan() {
  const client = generateClient<Schema>();

  const { data: Plan } = useSWR("api/plan");

  // Function to create a project
  const createPlan = async (key: string, { arg }: { arg: CreatePlanInput }) => {

    console.log("arg", arg)
    const response = await client.models.Plan.create({

      quarterlyPlanId: arg.quarterlyPlanId,
      activity: arg.activity,
      month: arg.month,
      functionalAreaId: arg.functionalAreaId,
      comments: arg.comments,
      isMajorGoal: arg.isMajorGoal,
    });
console.log("response",response)
    if (response?.data) {
      const newPlan = {
        id: response.data.id,
        quarterlyPlanId: response.data.quarterlyPlanId,
        activity: response.data.activity,
        month: response.data.month,
        functionalAreaId: response.data.functionalAreaId,
        comments: response.data.comments,
        isMajorGoal: response.data.isMajorGoal,
      } as PlanResponse;

      return newPlan;
    }

    throw new Error("Failed to create the  Plan");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/create-plan", createPlan);

  return {
    createPlan: trigger,  // Function to initiate the Plan creation
    createdPlan: data,    // The created Plan data
    isCreatingPlan: isMutating,  // Loading state
    createError: error,      // Error state
  };
}
