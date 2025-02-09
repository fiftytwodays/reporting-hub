import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface UpdateYearlyPlanInput {
  user: string;
  projectId: string;
  comments: string;
  status: string;
  year: string;
  id?: string;
}

interface YearlyPlanResponse {
  id: string;
  user: string;
  projectId: string;
  comments: string;
  status: string;
  year: string;
}

export default function useUpdateYearlyPlan() {
  const client = generateClient<Schema>();

  const { data: yearlyPlan } = useSWR("api/updateYearlyPlan");

  const updateYearlyPlan = async (key: string, { arg }: { arg: UpdateYearlyPlanInput }) => {
    const response = await client.models.YearlyPlan.update({
      user: arg.user,
      projectId: arg.projectId,
      comments: arg.comments,
      status: arg.status,
      year: arg.year,
      id: arg.id ?? "",
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

    throw new Error("Failed to update the Yearly Plan");
  };
  //  Use SWR Mutation to handle the creation request
   const { trigger, data, isMutating, error } = useSWRMutation("api/update-yearly-form", updateYearlyPlan);

   return {
     updateYearlyPlan: trigger,  // Function to initiate the YearlyPlan creation
     updatedYearlyPlan: data,    // The created YearlyPlan data
     isUpdatingYearlyPlan: isMutating,  // Loading state
     updatingError: error,      // Error state
   };
  
}
