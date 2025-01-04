export interface ReportingStatusReport {
  id: number;
  project: string;
  cluster: string;
  region: string;
  facilitator: string;
  status: string;
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
