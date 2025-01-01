export interface MonthlyForm {
  id: string | number;
  name: string;
  location: string;
  month: string;
  year: string;
  status: String;
}

export interface ApiResponse {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  MonthlyForms: MonthlyForm[];
}
