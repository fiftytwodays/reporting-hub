import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

interface deleteProjectTypeInput {
  id: string;
}

interface ProjectTypeResponse {
  id: string;
  name: string;
  description?: string;
}

export default function useDeleteProjectType() {
  const client = generateClient<Schema>();

  const deleteProjectType = async (key: string, { arg }: { arg: deleteProjectTypeInput }) => {

    const response = await client.models.ProjectType.delete({id: arg.id});

    if (response?.data) {
      return {
        id: response.data.id,
        name: response.data.name ?? "",
        description: response.data.description ?? "",
      } as ProjectTypeResponse;
    }
    else{
    throw new Error("Failed to delete the project type");
    }
  };

  const { trigger, data, isMutating, error } = useSWRMutation("api/delete-region", deleteProjectType);

  return {
    deleteProjectType: trigger, // Function to initiate the project type deletion
    deletedProjectType: data,  // The deleted project type data
    isDeleting: isMutating, // Loading state
    deleteError: error,     // Error state
  };
}
