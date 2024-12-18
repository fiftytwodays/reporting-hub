export interface Project {
  id: string;
  name: string;
  location: string;
  projectType: string;
  cluster: string;
  description: string;
  projectTypeId: string;
  clusterId: string;
}

export interface ApiResponse {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  Projects: Project[];
}
