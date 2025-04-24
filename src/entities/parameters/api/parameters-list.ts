import useSWR from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";
import { mutate } from "swr"; // Correct for SWR < 2.0 or SWR with named exports

import type { Parameters } from "../config/types";
import { start } from "repl";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  Parameters: Parameters;
}

export default function useParameters({ condition = true }: FetchOptions) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const response = await client.models.Parameters.list();
    if (response?.data) {
      const parameters = {
        id: response.data.at(0)?.id ?? "",
        monthlyFormStartDate: response.data.at(0)?.monthlyFormStartDate ?? "",
        quarterlyPlanResetDate:
          response.data.at(0)?.quarterlyPlanResetDate ?? "",
        startYear: response.data.at(0)?.startYear ?? "",
      };

      const apiResponse: ApiResponse = {
        Parameters: parameters,
      };

      console.log("API Response:", apiResponse);
      
      return apiResponse;
    }
    return null;
  };

  const { data, isLoading, error } = useSWR(
    condition ? ["api/parameters"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadParametersList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("api/parameters")),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  const parametersData = data?.Parameters;
  return {
    parametersList: parametersData,
    isParametersListLoading: isLoading,
    isParametersListError: error,
    reloadParametersList,
  };
}
