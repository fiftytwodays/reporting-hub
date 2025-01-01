export interface YearlyPlan {
  id: string;
  project: string;
  year: string;
  status: string;
  comments: string;
}

export interface ApiResponse {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  YearlyPlans: YearlyPlan[];
}
