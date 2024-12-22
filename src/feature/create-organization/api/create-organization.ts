import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface CreateOrganizationInput {
  name: string;
  website: string;
  address: string;
  logo?: string;
  phoneNumber: string;
  email: string;
  description: string;
  history: string;
  mission: string;
  vision: string;
  coreValues: string;
}

interface OrganizationResponse {
  id: string;
  name: string;
  website: string;
  address: string;
  logo: string;
  phoneNumber: string;
  email: string;
  description: string;
  history: string;
  mission: string;
  vision: string;
  coreValues: string;
}

export default function useCreateOrganzation() {
  const client = generateClient<Schema>();

  const { data: organizations } = useSWR("api/organizations");

  const createOrganzation = async (
    key: string,
    { arg }: { arg: CreateOrganizationInput }
  ) => {
    const organizationData: CreateOrganizationInput = {
      name: arg.name,
      website: arg.website,
      address: arg.address,
      phoneNumber: arg.phoneNumber,
      email: arg.email,
      description: arg.description,
      history: arg.history,
      mission: arg.mission,
      vision: arg.vision,
      coreValues: arg.coreValues,
      logo: arg.logo,
    };
    const response = await client.models.Organization.create(organizationData);

    if (response?.data) {
      const newCluster = {
        id: response.data.id,
        name: response.data.name,
        website: response.data.website,
        address: response.data.address,
        logo: response.data.logo,
        phoneNumber: response.data.phoneNumber,
        email: response.data.email,
        description: response.data.description,
        history: response.data.history,
        mission: response.data.mission,
        vision: response.data.vision,
        coreValues: response.data.coreValues,
      } as OrganizationResponse;

      return newCluster;
    }
    throw new Error("Failed to create the organization");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation(
    "api/create-organization",
    createOrganzation
  );

  return {
    createOrganzation: trigger, // Function to initiate the organization creation
    createdOrganization: data, // The created organization data
    isCreating: isMutating, // Loading state
    createError: error, // Error state
  };
}
