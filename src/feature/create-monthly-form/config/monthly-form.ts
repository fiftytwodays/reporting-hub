export interface MonthlyFormGoals {
  CurrentMonthGoals: Goal[];
  NextMonthGoals: Goal[];
}

export interface Goal {
  id: string;
  activity: string;
  month: string;
  functionalAreaId: (string | null) | undefined;
  comments?:  (string | null) | undefined;
  isMajorGoal:  (boolean | null) | undefined;
}
