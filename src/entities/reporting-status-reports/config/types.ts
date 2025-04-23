export interface ReportingStatusReport {
  id: string;
  project: string;
  cluster: string;
  region: string;
  facilitator: string;
  status: string;
  date: string;
  reportingMonth: string;
  year: string;
  goalsFromLastMonth: Goal[] | null;
  additionalActivities: Goal[] | null;
  nextMonthGoal: Goal[] | null;
  nextMonthAdditional: Goal[] | null;
  praisePoints: string[];
  prayerRequests: string[];
  story: string;
  concerns: string;
}

export interface Goal {
  activityName?: string;
  activity?: string;
  achieved?: string | boolean; // Optional since it's only present in completed/ongoing goals
  isMajorGoal?: string | boolean | null | undefined; // Optional as not all goals are major
  reason?: string; // Optional as not all goals might have a reason
  comments?: string | null | undefined; // Optional to allow flexibility
  functionalArea?: string; // Optional as not all goals might have a functional area
}

export interface ApiResponse {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  ReportingStatusReports: ReportingStatusReport[];
}
