import type { Schema } from "../../resource";
import { generateClient } from 'aws-amplify/api';

const client = generateClient<Schema>();
type Handler = Schema["listProjects"]["functionHandler"];

export const handler: Handler = async () => {
  console.log("My response in handler42444");
  try {
    console.log("My response in handler42444");
    console.log("My response in handler42444", client.mutations.listProjects({}));
    const projects = await client.models.Project.list(); // One-time query to fetch all projects
    console.log("My response in handler", projects)
    return {
      statusCode: 200,
      body: JSON.stringify(projects),
    };
  } catch (error) {
    console.log("wkfmiwfiwnfiwifnwinwjfeonofuhweoknweio");
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch projectsjwndjwnfjwnjkn", error }),
    };
  }
};
