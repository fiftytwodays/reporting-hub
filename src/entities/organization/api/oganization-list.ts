import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

import type { Organization } from "../config/types";

interface FetchOptions {
  condition: boolean;
}

interface ApiResponse {
  Organizations: Organization[];
}

export default function useOrganizationsList({
  condition = true,
}: FetchOptions) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const response = await client.models.Organization.list();
    if (response?.data) {
      const organizations = await Promise.all(
        response.data.map(async (organization) => {
          return {
            id: organization.id ?? "",
            name: organization.name ?? "",
            website: organization.website ?? "",
            address: organization.address ?? "",
            phoneNumber: organization.phoneNumber ?? "",
            email: organization.email ?? "",
            description: organization.description ?? "",
            history: organization.history ?? "",
            mission: organization.mission ?? "",
            vision: organization.vision ?? "",
            coreValues: organization.coreValues ?? "",
            logo: organization.logo ?? "",
          };
        })
      );

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

  const organizationsData = data?.Organizations?.map((organization, index) => ({
    key: index,
    id: organization.id ?? "",
    name: organization.name ?? "",
    website: organization.website ?? "",
    address: organization.address ?? "",
    phoneNumber: organization.phoneNumber ?? "",
    email: organization.email ?? "",
    description: organization.description ?? "",
    history: organization.history ?? "",
    mission: organization.mission ?? "",
    vision: organization.vision ?? "",
    coreValues: organization.coreValues ?? "",
    logo: organization.logo ?? "",
  }));
  return {
    organizationsList: organizationsData ?? [],
    isOrganizationsListLoading: isLoading,
    isOrganziationsListError: error,
    reloadOrganizationList,
  };
}
