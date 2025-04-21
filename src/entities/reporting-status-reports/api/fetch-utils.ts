import { getAdditionalActivitiesNextMonthByMonthlyFormId } from "@/feature/create-monthly-form/api/get-additionalActivity-nextMonth-specific";
import { getAdditionalActivitiesByMonthlyFormId } from "@/feature/create-monthly-form/api/get-additionalActivity-specific";
import usePlansFetcher from "@/feature/create-monthly-form/api/get-all-goals";
import { getOutcomeByMonthlyFormId } from "@/feature/create-monthly-form/api/get-outcomes-specific";

export const fetchOutcomeByMonthlyFormId = async (monthlyFormId: string) => {
  const { outcomes } = getOutcomeByMonthlyFormId({
    condition: true,
    monthlyFormId,
  });
  return outcomes;
};

export const fetchAdditionalActivitiesByMonthlyFormId = async (
  monthlyFormId: string
) => {
  const { additionalActivities } = getAdditionalActivitiesByMonthlyFormId({
    condition: true,
    monthlyFormId,
  });
  return additionalActivities;
};

export const fetchAdditionalActivitiesNextMonthByMonthlyFormId = async (
  monthlyFormId: string
) => {
  const { additionalActivitiesNextMonth } =
    getAdditionalActivitiesNextMonthByMonthlyFormId({
      condition: true,
      monthlyFormId,
    });
  return additionalActivitiesNextMonth;
};

export const fetchPlansByProjectUserMonthYear = async ({
  projectId,
  userId,
  month,
  year,
}: {
  projectId: string;
  userId: string;
  month: number;
  year: number;
}) => {
  const { plans } = usePlansFetcher({
    condition: true,
    projectId,
    userId,
    month,
    year,
  });
  return plans;
};
