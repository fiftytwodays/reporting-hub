export interface ProjectType {
  id: string;
  name: string;
  description: string;
}

export interface ApiResponse {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  ProjectTypes: ProjectType[];
}
