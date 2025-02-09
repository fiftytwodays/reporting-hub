import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";
import { message } from "antd";

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

interface CustomError {
  statusCode: number;
  message: string;
}

export default function useCreateYearlyPlan() {
  const client = generateClient<Schema>();

  const { data: yearlyPlan } = useSWR("api/yearlyPlan");

  const createYearlyPlan = async (key: string, { arg }: { arg: CreateYearlyPlanInput }) => {

    const existingPlan = await client.models.YearlyPlan.list({
      filter: {
        and: [
          { projectId: { eq: arg.projectId } },
          { user: { eq: arg.user } },
        ],
      }
    });

    if(existingPlan?.data.length > 0){
      console.log("After Throw")
      throw {statusCode: 409, message:"The yearly plan for this project already exist"} as CustomError;
      console.log("After Throw")
    }

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
     createError: error as CustomError | null,      // Error state
   };
  
}
