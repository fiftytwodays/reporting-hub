export interface MiscellaneousProjectReport {
  id: number;
  project: string;
  cluster: string;
  region: string;
  facilitator: string;
  status: string;
  type: Array<String>;
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
