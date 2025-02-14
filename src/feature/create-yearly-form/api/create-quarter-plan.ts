import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface CreateQuarterlyPlanInput {

  yearlyPlanId: string,
  quarter: number,
  status: string,
}

interface QuarterlyPlanResponse {
  id: string;
  yearlyPlanId: string,
  quarter: number,
  status: string,
}

export default function useCreateQuarterlyPlan() {
  const client = generateClient<Schema>();

  const { data: quarterlyPlan } = useSWR("api/quarterlyPlan");

  // Function to create a project
  const createQuarterlyPlan = async (key: string, { arg }: { arg: CreateQuarterlyPlanInput }) => {
    const response = await client.models.QuarterlyPlan.create({
      yearlyPlanId: arg.yearlyPlanId,
      quarter: arg.quarter,
      status: arg.status,
    });

    if (response?.data) {
      const newQuarterlyPlan = {
        id: response.data.id,
        yearlyPlanId: response.data.yearlyPlanId,
        quarter: response.data.quarter,
        status: response.data.status,
      } as QuarterlyPlanResponse;

      return newQuarterlyPlan;
    }

    throw new Error("Failed to create the Quarterly Plan");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/create-quarterly-form", createQuarterlyPlan);

  return {
    createQuarterlyPlan: trigger,  // Function to initiate the QuarterlyPlan creation
    createdQuarterlyPlan: data,    // The created QuarterlyPlan data
    isCreatingQuarterlyPlan: isMutating,  // Loading state
    createError: error,      // Error state
  };
}
