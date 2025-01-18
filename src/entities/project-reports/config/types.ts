export interface Goal {
  goal: string;
  functionalArea: string;
  achieved?: string; // Optional since it's only present in completed/ongoing goals
  reason?: string; // Optional as not all goals might have a reason
  comments?: string; // Optional to allow flexibility
}

export interface MonthlyGoal extends Goal {
  achieved: string;
  reason: string;
  comments: string;
}

export interface NextMonthGoal extends Goal {
  comments: string;
}

export interface ProjectReport {
  id: number;
  project: string;
  cluster: string;
  region: string;
  facilitator: string;
  status: string;
  date: string;
  reportingMonth: string;
  year: string;
  goalsFromLastMonth: MonthlyGoal[];
  additionalActivities: MonthlyGoal[];
  nextMonthGoal: NextMonthGoal[];
  nextMonthAdditional: NextMonthGoal[];
}


export interface ApiResponse {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  ProjectReports: ProjectReport[];
}
