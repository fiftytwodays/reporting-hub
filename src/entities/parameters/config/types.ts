export interface Parameters {
  id: string;
  monthlyFormStartDate: string;
  quarterlyPlanResetDate: string;
}

export interface ApiResponse {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  Parameters: Parameters;
}
