export interface Cluster {
  id: string;
  name: string;
  region: string;
  description: string;
  regionId: string;
}

export interface ApiResponse {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  Clusters: Cluster[];
}
