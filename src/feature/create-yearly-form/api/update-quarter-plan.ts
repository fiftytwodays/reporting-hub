import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface UpdateQuarterlyPlanInput {

  yearlyPlanId: string,
  quarter: number,
  status: string,
  id?: string,
}

interface QuarterlyPlanResponse {
  id: string;
  yearlyPlanId: string,
  quarter: number,
  status: string,
}

export default function useUpdateQuarterlyPlan() {
  const client = generateClient<Schema>();

  const { data: quarterlyPlan } = useSWR("api/updateQuarterlyPlan");

  // Function to create a project
  const updateQuarterlyPlan = async (key: string, { arg }: { arg: UpdateQuarterlyPlanInput }) => {
    let response;
    if(arg.id){
     response = await client.models.QuarterlyPlan.update({
      yearlyPlanId: arg.yearlyPlanId,
      quarter: arg.quarter,
      status: arg.status,
      id: arg?.id,
    });
  }
    if (response?.data) {
      const newQuarterlyPlan = {
        id: response.data.id,
        yearlyPlanId: response.data.yearlyPlanId,
        quarter: response.data.quarter,
        status: response.data.status,
      } as QuarterlyPlanResponse;

      return newQuarterlyPlan;
    }

    throw new Error("Failed to update the Quarterly Plan");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/update-quarterly-form", updateQuarterlyPlan);

  return {
    updateQuarterlyPlan: trigger,  // Function to initiate the QuarterlyPlan creation
    updatedQuarterlyPlan: data,    // The created QuarterlyPlan data
    isUpdatingQuarterlyPlan: isMutating,  // Loading state
    updateError: error,      // Error state
  };
}
