import useSWR from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";
import { mutate } from 'swr'; // Correct for SWR < 2.0 or SWR with named exports


import type { Organization } from "../config/types";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  Organizations: Organization;
}

export default function useOrganization({
  condition = true,
}: FetchOptions) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const response = await client.models.Organization.list();
    if (response?.data) {
      const organizations = 
          {
            id: response.data.at(0)?.id ?? "",
            name: response.data.at(0)?.name ?? "",
            website: response.data.at(0)?.website ?? "",
            address: response.data.at(0)?.address ?? "",
            phoneNumber: response.data.at(0)?.phoneNumber ?? "",
            email: response.data.at(0)?.email ?? "",
            description: response.data.at(0)?.description ?? "",
            history: response.data.at(0)?.history ?? "",
            mission: response.data.at(0)?.mission ?? "",
            vision: response.data.at(0)?.vision ?? "",
            coreValues: response.data.at(0)?.coreValues ?? "",
            logo: response.data.at(0)?.logo ?? "",
          };

      const apiResponse: ApiResponse = {
        Organizations: organizations,
      };

      return apiResponse;
    }
    return null;
  };

  const { data, isLoading, error } = useSWR(
    condition ? ["api/organizations"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadOrganizationList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("api/organizations")),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  const organizationsData = data?.Organizations
  return {
    organizationsList: organizationsData,
    isOrganizationsListLoading: isLoading,
    isOrganziationsListError: error,
    reloadOrganizationList,
  };
}
