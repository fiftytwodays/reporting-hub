import type { Schema } from "@root/amplify/data/resource";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import useSWR from "swr";

interface CreateProjectInput {
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

export default function useCreateProject() {
  const client = generateClient<Schema>();

  const { data: projects } = useSWR("api/projects");
  

console.log(projects);

  // Function to create a project
  const createProject = async (key: string, { arg }: { arg: CreateProjectInput }) => {
    const response = await client.models.Project.create({
      name: arg.name,
      location: arg.location,
      projectTypeId: arg.projectTypeId,
      clusterId: arg.clusterId,
      description: arg.description,
    });

    if (response?.data) {
      const newProject = {
        id: response.data.id,
        name: response.data.name ?? "",
        location: response.data.location ?? "",
        projectTypeId: response.data.projectTypeId,
        clusterId: response.data.clusterId,
        description: response.data.description ?? "",
      } as ProjectResponse;

      return newProject;
    }

    throw new Error("Failed to create the project");
  };

  // Use SWR Mutation to handle the creation request
  const { trigger, data, isMutating, error } = useSWRMutation("api/create-project", createProject);

  return {
    createProject: trigger,  // Function to initiate the project creation
    createdProject: data,    // The created project data
    isCreating: isMutating,  // Loading state
    createError: error,      // Error state
  };
}
