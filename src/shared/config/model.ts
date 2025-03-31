// src/shared/models.ts

// FunctionalArea Interface
export interface FunctionalArea {
  id: string;
  name: string;
  description?: string;
  plan: Plan[];
}

// ProjectType Interface
export interface ProjectType {
  id: string;
  name: string;
  description?: string;
  projects: Project[];
}

// Cluster Interface
export interface Cluster {
  id: string;
  name: string;
  description?: string;
  regionId: string;
  region: Region;
  projects: Project[];
}

// Region Interface
export interface Region {
  id: string;
  name: string;
  description?: string;
}

// Project Interface
export interface Project {
  id: string;
  name: string;
  location: string;
  projectTypeId: string;
  projectType: ProjectType;
  clusterId: string;
  cluster: Cluster;
  description?: string;
  yearlyPlan: YearlyPlan[];
}

// YearlyPlan Interface
export interface YearlyPlan {
  user: string;
  userId: string;
  projectId: string;
  project?: Project;
  comments?: string;
  status: string;
  year: string;
  reviewedBy?: string;
  approvedBy?: string;
  quarterlyPlan: QuarterlyPlan[];
}

// QuarterlyPlan Interface
export interface QuarterlyPlan {
  yearlyPlanId: string;
  yearlyPlan: YearlyPlan;
  quarter: number;
  status: string;
  reviewedBy?: string;
  approvedBy?: string;
  plan: Plan[];
}

// Plan Interface
export interface Plan {
  quarterlyPlanId?: (string | null) | undefined;
  activity: string;
  month?: (string | null)[] | null | undefined;
  functionalAreaId?:  (string | null) | undefined;
  comments?: string | null;
  isMajorGoal?: (boolean | null) | undefined;
}
