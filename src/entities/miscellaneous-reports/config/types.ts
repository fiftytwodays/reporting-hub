export interface MiscellaneousProjectReport {
  id: number;
  project: string;
  facilitator: string;
  concerns?: string;
  story?: string;
  praisePoints?: Array<string>;
  prayerRequests?: Array<string>;
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
