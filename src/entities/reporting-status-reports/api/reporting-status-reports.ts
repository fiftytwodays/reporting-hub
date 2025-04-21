import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";
import useUsersList from "@/entities/user/api/users-list";
import { ReportingStatusReport } from "../config/types";
import {
  fetchOutcomeByMonthlyFormId,
  fetchAdditionalActivitiesByMonthlyFormId,
  fetchAdditionalActivitiesNextMonthByMonthlyFormId,
  fetchPlansByProjectUserMonthYear,
} from "../api/fetch-utils"; // You need to create this helper

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

const getMonthNumber = (month: string) => {
  const index = monthNames.findIndex(
    (m) => m.toLowerCase() === month.toLowerCase()
  );
  return index !== -1 ? index + 1 : -1;
};

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
    const monthlyFormsResponse =
      await client.models.MonthlyForm.listMonthlyFormByYear({ year });

    if (!monthlyFormsResponse?.data?.length) {
      return { ReportingStatusReport: [] };
    }
    const forms = monthlyFormsResponse.data.filter(
      (f) => Number(f.month) === Number(month) && f.status !== "draft"
    );

    const monthlyForms = await Promise.all(
      forms.map(async (form) => {
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

        const [
          outcomesRes,
          additionalActivitiesRes,
          additionalActivitiesNextMonthRes,
          plansRes,
        ] = await Promise.allSettled([
          fetchOutcomeByMonthlyFormId(form.id),
          fetchAdditionalActivitiesByMonthlyFormId(form.id),
          fetchAdditionalActivitiesNextMonthByMonthlyFormId(form.id),
          fetchPlansByProjectUserMonthYear({
            projectId: form.projectId,
            userId: form.facilitator ?? "",
            month: getMonthNumber(form.month),
            year: parseInt(form.year, 10),
          }),
        ]);

        if (outcomesRes.status === "rejected")
          console.error("Outcomes error:", outcomesRes.reason);
        if (additionalActivitiesRes.status === "rejected")
          console.error(
            "Additional activities error:",
            additionalActivitiesRes.reason
          );
        if (plansRes.status === "rejected")
          console.error("Plans error:", plansRes.reason);

        const outcomes =
          outcomesRes.status === "fulfilled" ? outcomesRes.value : [];
        const additionalActivities =
          additionalActivitiesRes.status === "fulfilled"
            ? additionalActivitiesRes.value
            : [];
        const additionalActivitiesNextMonth =
          additionalActivitiesNextMonthRes.status === "fulfilled"
            ? additionalActivitiesNextMonthRes.value
            : [];
        const plans = plansRes.status === "fulfilled" ? plansRes.value : {};

        console.log("Fetched additional activities:", additionalActivities);
        console.log(
          "Fetched additional activities next month:",
          additionalActivitiesNextMonth
        );
        console.log("Fetched plans:", plans);
        console.log("Fetched outcomes:", outcomes);
        console.log("Fetched project details:", projectDetails);
        console.log("Fetched user details:", userDetails);
        console.log("Fetched cluster details:", clusterDetails);
        console.log("Fetched region details:", regionDetails);

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
          reportingMonth: form.month ?? "",
          year: form.year ?? "",
          date: form.createdAt ?? "",
          goalsFromLastMonth: outcomes,
          additionalActivities,
          nextMonthGoal:
            Array.isArray(plans) || !plans?.NextMonthGoals
              ? []
              : plans.NextMonthGoals,
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
      })
    );

    console.log("Processed monthly forms:", monthlyForms);

    return {
      ReportingStatusReport: monthlyForms,
    };
  };

  const { data, isLoading, error } = useSWR(
    condition ? [`api/reporting-status-reports`, year, month] : null,
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
