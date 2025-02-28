export interface YearlyPlan {
  userId: string;
  id: string;
  project: string;
  year: string;
  status: string;
  comments: string;
  user: string;
}

export interface YearlyPlanDetails {
  id: string;
  user: string;
  projectName: string;
  year: string;
}

export interface QuarterlyPlan {
  approvedBy: string;
  quarter: number;
  yearlyPlanId: string;
  id: string;
  reviewedBy: string;
  status: string;
  updatedAt: string;
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
