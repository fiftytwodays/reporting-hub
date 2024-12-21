export interface UserAttribute {
  Name: string;
  Value: string;
}

export interface User {
  Attributes?: UserAttribute[];
  Enabled: boolean;
  UserCreateDate: string;
  UserLastModifiedDate: string;
  UserStatus: string;
  Username: string;
  Email: string;
  GivenName: string;
  EmailVerified?: string;
  FamilyName?: string;
  Projects?: string;
  Clusters?: string;
  Regions?: string;
  Sub?: string;
}

export interface UserGroup {
  CreationDate: string;
  GroupName: string;
  LastModifiedDate: string;
  Precedence: number;
  RoleArn: string;
  UserPoolId: string;
}

export interface ApiResponse {
  $metadata: {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
  };
  Users: User[];
}
