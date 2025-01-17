export interface MiscellaneousProjectReport {
  id: number;
  project: string;
  facilitator: string;
  type?: Array<String>;
  praisePoints?: Array<String>;
  prayerRequests?: Array<String>;
}

export interface ApiResponse {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  MiscellaneousProjectReports: MiscellaneousProjectReport[];
}
