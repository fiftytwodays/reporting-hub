import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface CreateYearlyPlanInput {
  user: string;
  projectId: string;
  comments: string;
  status: string;
  year: string;
}

interface YearlyPlanResponse {
  id: string;
  user: string;
  projectId: string;
  comments: string;
  status: string;
  year: string;
}

export default function useCreateYearlyPlan() {
  const client = generateClient<Schema>();

  const { data: yearlyPlan } = useSWR("api/yearlyPlan");

  const createYearlyPlan = async (key: string, { arg }: { arg: CreateYearlyPlanInput }) => {
    const response = await client.models.YearlyPlan.create({
      user: arg.user,
      projectId: arg.projectId,
      comments: arg.comments,
      status: arg.status,
      year: arg.year,
    });

    if (response?.data) {
      const newYearlyPlan = {
        id: response.data.id,
        user: response.data.user,
        projectId: response.data.projectId,
        comments: response.data.comments,
        status: response.data.status,
        year: response.data.year,
      } as YearlyPlanResponse;

      return newYearlyPlan;
    }

    throw new Error("Failed to create the Yearly Plan");
  };
  //  Use SWR Mutation to handle the creation request
   const { trigger, data, isMutating, error } = useSWRMutation("api/create-yearly-form", createYearlyPlan);

   return {
     createYearlyPlan: trigger,  // Function to initiate the YearlyPlan creation
     createdYearlyPlan: data,    // The created YearlyPlan data
     isCreatingYearlyPlan: isMutating,  // Loading state
     createError: error,      // Error state
   };
  
}
