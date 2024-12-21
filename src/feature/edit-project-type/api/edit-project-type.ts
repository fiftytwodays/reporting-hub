import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

interface EditProjectTypeInput {
  id: string;
  name: string;
  description?: string;
}

interface ProjectTypeResponse {
  id: string;
  name: string;
  description?: string;
}

export default function useEditProjectType() {
  const client = generateClient<Schema>();

  // Function to update a project type
  const updateProjectType = async (key: string, { arg }: { arg: EditProjectTypeInput }) => {

    const response = await client.models.ProjectType.update({
      id: arg.id,
      name: arg.name,
      description: arg.description,
    });

    if (response?.data) {
      return {
        id: response.data.id,
        name: response.data.name ?? "",
        description: response.data.description ?? "",
      } as ProjectTypeResponse;
    }
    throw new Error("Failed to update the project type");
  };

  // Use SWR Mutation to handle the updation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/update-project-type", updateProjectType);

  return {
    updateProjectType: trigger, // Function to initiate the project type updation
    updatedProjectType: data,  // The updated project type data
    isUpdating: isMutating, // Loading state
    updateError: error,     // Error state
  };
}
