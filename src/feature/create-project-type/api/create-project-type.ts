import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface CreateProjectTypeInput {
  name: string;
  description?: string;
}

interface ProjectTypeResponse {
  id: string;
  description?: string;
}

export default function useCreateProjectType() {
  const client = generateClient<Schema>();

  const { data: regions } = useSWR("api/project-type");
  
  // Function to create a project
  const createProjectType = async (key: string, { arg }: { arg: CreateProjectTypeInput }) => {
    const response = await client.models.ProjectType.create({
      name: arg.name,
      description: arg.description,
    });

    if (response?.data) {
      const newProjectType = {
        id: response.data.id,
        name: response.data.name ?? "",
        description: response.data.description ?? "",
      } as ProjectTypeResponse;

      return newProjectType;
    }

    throw new Error("Failed to create the project type");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/create-project-type", createProjectType);

  return {
    createProjectType: trigger,  // Function to initiate the project type creation
    createdProjectType: data,    // The created project type data
    isCreating: isMutating,  // Loading state
    createError: error,      // Error state
  };
}
