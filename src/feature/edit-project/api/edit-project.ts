import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";

interface EditProjectInput {
  id: string;
  name: string;
  location: string;
  projectTypeId: string;
  clusterId: string;
  description?: string;
}

interface ProjectResponse {
  id: string;
  name: string;
  location: string;
  projectTypeId: string;
  clusterId: string;
  description?: string;
}

export default function useEditProject() {
  const client = generateClient<Schema>();

  // Function to create a project
  const updateProject = async (key: string, { arg }: { arg: EditProjectInput }) => {

    const response = await client.models.Project.update({
      id: arg.id,
      name: arg.name,
      location: arg.location,
      projectTypeId: arg.projectTypeId,
      clusterId: arg.clusterId,
      description: arg.description,
    });

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
    throw new Error("Failed to update the project");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/update-project", updateProject);

  return {
    updateProject: trigger, // Function to initiate the project updation
    updatedProject: data,  // The updated project data
    isUpdating: isMutating, // Loading state
    updateError: error,     // Error state
  };
}
