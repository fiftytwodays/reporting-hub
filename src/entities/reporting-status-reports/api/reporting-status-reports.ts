import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";
import useUsersList from "@/entities/user/api/users-list";
import { ReportingStatusReport } from "../config/types";
import {
  getAdditionalActivitiesByMonthlyFormId,
  getAdditionalActivitiesNextMonthByMonthlyFormId,
  getOutcomeByMonthlyFormId,
  getPlans,
} from "../api/fetch-utils";

interface FetchOptions {
  condition: boolean;
  year: string;
  month: string;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getMonthName = (month: number) =>
  monthNames[month - 1] || "Invalid month";

export function useProjectReportStatus({
  condition = true,
  year,
  month,
}: FetchOptions) {
  const { usersList, isUsersListLoading } = useUsersList({ condition: true });
  const client = generateClient<Schema>();

  const fetcher = async () => {
    try {
      console.log(
        "Fetching monthly forms for year:",
        year,
        "and month:",
        month
      );

      const monthlyFormsResponse =
        await client.models.MonthlyForm.listMonthlyFormByYear({ year });

      if (!monthlyFormsResponse?.data?.length) {
        console.log("No monthly forms found for the given year.");
        return { ReportingStatusReport: [] };
      }

      const forms = monthlyFormsResponse.data.filter(
        (f) => Number(f.month) === Number(month) && f.status !== "draft"
      );

      console.log("Filtered forms:", forms);

      const monthlyForms = await Promise.all(
        forms.map(async (form) => {
          try {
            console.log("Processing form:", form);

            const [projectDetails, userDetails] = await Promise.all([
              client.models.Project.get({ id: form.projectId }),
              Promise.resolve(
                usersList.find((user) => user.Username === form.facilitator)
              ),
            ]);

            const clusterDetails = await client.models.Cluster.get({
              id: projectDetails.data?.clusterId ?? "",
            });

            const regionDetails = await client.models.Region.get({
              id: clusterDetails.data?.regionId ?? "",
            });

            const plansRes = await getPlans({
              condition: true,
              projectId: form.projectId,
              userId: form.facilitator ?? "",
              month: Number(form.month),
              year: parseInt(form.year, 10),
            });

            const outcomesRes = await getOutcomeByMonthlyFormId({
              condition: true,
              monthlyFormId: form.id ?? "",
            });

            const additionalActivitiesRes =
              await getAdditionalActivitiesByMonthlyFormId({
                condition: true,
                monthlyFormId: form.id ?? "",
              });

            const additionalActivitiesNextMonthRes =
              await getAdditionalActivitiesNextMonthByMonthlyFormId({
                condition: true,
                monthlyFormId: form.id ?? "",
              });

            const plans: any[] = plansRes.Plans.NextMonthGoals;

            console.log("Plans res", plansRes);
            console.log("Plans:", plans);

            const additionalActivities: any[] =
              (await additionalActivitiesRes) ?? [];
            const additionalActivitiesNextMonth: any[] =
              additionalActivitiesNextMonthRes ?? [];
            const outcomes: any[] = outcomesRes ?? [];

            console.log(
              "Plans, Additional Activities, Outcomes:",
              plans,
              additionalActivities,
              outcomes,
              additionalActivitiesNextMonth
            );

            return {
              id: form.id ?? "",
              project: projectDetails.data?.name ?? "",
              facilitator: userDetails
                ? `${userDetails.GivenName ?? ""} ${
                    userDetails.FamilyName ?? ""
                  }`.trim()
                : "",
              cluster: clusterDetails.data?.name ?? "",
              region: regionDetails.data?.name ?? "",
              status: form.status ?? "",
              reportingMonth: getMonthName(Number(form.month)) ?? "",
              year: form.year ?? "",
              date: form.createdAt ?? "",
              goalsFromLastMonth: outcomes,
              additionalActivities: additionalActivities,
              nextMonthGoal: plans,
              nextMonthAdditional: additionalActivitiesNextMonth,
              concerns: form.concerns ?? "",
              story: form.story ?? "",
              praisePoints: (form.praisePoints ?? []).filter(
                (p): p is string => p !== null
              ),
              prayerRequests: (form.prayerRequests ?? []).filter(
                (p): p is string => p !== null
              ),
            };
          } catch (error) {
            console.error("Error processing form:", form, error);
            throw error;
          }
        })
      );

      console.log("Processed monthly forms:", monthlyForms);

      return {
        ReportingStatusReport: monthlyForms,
      };
    } catch (error) {
      console.error("Error in fetcher:", error);
      throw error;
    }
  };

  const { data, isLoading, error } = useSWR(
    !isUsersListLoading ? [`api/reporting-status-reports`, year, month] : null,
    fetcher,
    { keepPreviousData: true }
  );

  const reloadProjectReportStatus = () => {
    mutate(
      (key) => Array.isArray(key) && key[0] === `api/reporting-status-reports`,
      undefined,
      { revalidate: true }
    );
  };

  return {
    projectReportStatusReport: data ?? null,
    isreloadProjectReportStatusReportLoading: isLoading || isUsersListLoading,
    isreloadProjectReportStatusReportError: error,
    reloadProjectReportStatus,
  };
}
