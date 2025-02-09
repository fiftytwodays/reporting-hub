export interface YearlyPlan {
  id: string;
  project: string;
  year: string;
  status: string;
  comments: string;
}

export interface YearlyPlanDetails {
  approvedBy: string;
  comments: string;
  createdAt: string;
  id: string;
  owner: string;
  projectId: string;
  reviewedBy: string;
  status: string;
  updatedAt: string;
  user: string;
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
