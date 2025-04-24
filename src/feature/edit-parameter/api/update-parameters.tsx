import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface UpdateParametersInput {
  id: string;
  monthlyFormStartDate: string;
  quarterlyPlanResetDate: string;
  startYear: string;
}

interface ParametersResponse {
  id: string;
  monthlyFormStartDate: string;
  quarterlyPlanResetDate: string;
  startYear: string;
}

export default function useUpdateParameters() {
  const client = generateClient<Schema>();

  const { data: parameters } = useSWR("api/parameters");

  const updateParameters = async (
    key: string,
    { arg }: { arg: UpdateParametersInput }
  ) => {
    const parametersData: UpdateParametersInput = {
      id: arg.id,
      monthlyFormStartDate: arg.monthlyFormStartDate,
      quarterlyPlanResetDate: arg.quarterlyPlanResetDate,
      startYear: arg.startYear,
    };

    const response = await client.models.Parameters.update(parametersData);
    if (response?.data) {
      const parameters = {
        id: response.data.id,
        monthlyFormStartDate: response.data.monthlyFormStartDate,
        quarterlyPlanResetDate: response.data.quarterlyPlanResetDate,
        startYear: response.data.startYear,
      } as ParametersResponse;

      return parameters;
    }
    throw new Error("Failed to update the parameters");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/update-parameters",
    updateParameters
  );

  return {
    updateParameters: trigger, // Function to initiate the organization creation
    updatedParameters: data, // The updated organization data
    isUpdating: isMutating, // Loading state
    updateError: error, // Error state
  };
}
