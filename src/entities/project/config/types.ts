// export interface ProjectAttribute {
//   Name: string;
//   Value: string;
// }



export interface Project {
  // Attributes?: ProjectAttribute[];
  Name: string;
  Location: string;
  ProjectType: string;
  Cluster: string
  Description: string;
  Actions: string;
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
