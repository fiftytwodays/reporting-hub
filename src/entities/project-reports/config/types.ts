export interface Goal {
  goal: string;
  majorGoal: boolean;
  functionalArea: string;
  achieved?: boolean; // Indicates if the goal was achieved (true/false)
  reason?: string; // Optional reason for achieving or not achieving the goal
  comments?: string; // Optional comments or additional notes about the goal
}

export interface MonthlyGoal extends Goal {
  achieved: boolean; // Indicates if the goal was achieved (true/false)
  reason: string; // Reason for achieving or not achieving the goal
  comments: string; // Comments or details about the goal
}

export interface NextMonthGoal extends Goal {
  comments: string; // Comments or details about the goal
}

export interface ProjectReport {
  id: number;
  project: string;
  cluster: string;
  region: string;
  facilitator: string;
  status: string;
  goals: {
    [year: string]: {
      [month: string]: MonthlyGoal[]; // Monthly goals for each year
    };
  };
  nextMonth: {
    goals: NextMonthGoal[]; // Goals to focus on in the next month
    additionalActivities: NextMonthGoal[]; // Additional activities for the next month
  };
  praisePoints: string[]; // List of praise points
  prayerRequests: string[]; // List of prayer requests
  story: string; // A story or testimony related to the project
  concerns: string; // Any concerns related to the project
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
