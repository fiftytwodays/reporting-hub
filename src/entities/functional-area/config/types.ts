export interface FunctionalArea {
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
  FunctionalAreas: FunctionalArea[];
}
