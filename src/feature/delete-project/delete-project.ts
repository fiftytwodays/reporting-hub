import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

interface deleteProjectInput {
  id: string;
}

interface ProjectResponse {
  id: string;
  name: string;
  location: string;
  projectTypeId: string;
  clusterId: string;
  description?: string;
}

export default function useDeleteProject() {
  const client = generateClient<Schema>();

  // Function to create a project
  const deleteProject = async (key: string, { arg }: { arg: deleteProjectInput }) => {

    const response = await client.models.Project.delete({id: arg.id});

    if (response?.data) {
      return {
        id: response.data.id,
        name: response.data.name ?? "",
        location: response.data.location ?? "",
        projectTypeId: response.data.projectTypeId,
        clusterId: response.data.clusterId,
        description: response.data.description ?? "",
      } as ProjectResponse;
    }
    else{
    throw new Error("Failed to delete the project");
    }
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/delete-project", deleteProject);

  return {
    deleteProject: trigger, // Function to initiate the project updation
    deletedProject: data,  // The updated project data
    isDeleting: isMutating, // Loading state
    deleteError: error,     // Error state
  };
}
