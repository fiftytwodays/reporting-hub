import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface CreateParametersInput {
  monthlyFormStartDate: string;
  quarterlyPlanResetDate: string;
}

interface ParametersResponse {
  id: string;
  monthlyFormStartDate: string;
  quarterlyPlanResetDate: string;
}

export default function useCreateParameters() {
  const client = generateClient<Schema>();

  const { data: parameters } = useSWR("api/parameters");
  console.log("The parameters form kmf", parameters);

  const createParameters = async (
    key: string,
    { arg }: { arg: CreateParametersInput }
  ) => {
    const parametersData: CreateParametersInput = {
      monthlyFormStartDate: arg.monthlyFormStartDate,
      quarterlyPlanResetDate: arg.quarterlyPlanResetDate,
    };
    console.log("Parameters data is ", parametersData);
    const response = await client.models.Parameters.create(parametersData);

    console.log("The respomnse is the response", response);
    if (response?.data) {
      const newCluster = {
        id: response.data.id,
        monthlyFormStartDate: response.data.monthlyFormStartDate,
        quarterlyPlanResetDate: response.data.quarterlyPlanResetDate,
      } as ParametersResponse;

      console.log("the sabed params ", newCluster);
      return newCluster;
    }
    throw new Error("Failed to create the parameters");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/create-parameters",
    createParameters
  );

  return {
    createParameters: trigger, // Function to initiate the parameters creation
    createdParameters: data, // The created parameters data
    isCreating: isMutating, // Loading state
    createError: error, // Error state
  };
}
