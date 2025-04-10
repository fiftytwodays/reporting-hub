import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";
import cluster from "cluster";

interface FetchOptions {
  condition: boolean;
  projectId: string;
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

export function useMonthlyForm({
  condition = true,
  formId,
}: {
  condition: boolean;
  formId: string;
}) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const response = await client.models.MonthlyForm.get({ id: formId });

    if (response?.data) {
      const form = response.data;
      const projectResponse = await client.models.Project.get({
        id: form.projectId,
      });
      const clusterId = projectResponse?.data?.clusterId;
      return {
        id: form.id ?? "",
        projectId: form.projectId ?? "",
        clusterId: clusterId ?? "",
        month: form.month ?? "",
        year: form.year ?? "",
        status: form.status ?? "",
        facilitator: form.facilitator ?? "",
        praisePoints: form.praisePoints ?? [],
        prayerRequests: form.prayerRequests ?? [],
        story: form.story ?? "",
        concerns: form.concerns ?? "",
        comments: form.comments ?? "",
        outcomes: form.outcomes ?? [],
      };
    }
    return null;
  };

  const { data, isLoading, error } = useSWR(
    condition ? [`api/monthlyForm/${formId}`] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadMonthlyForm = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith(`api/monthlyForm/${formId}`)),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  return {
    monthlyForm: data ?? null,
    isMonthlyFormLoading: isLoading,
    isMonthlyFormError: error,
    reloadMonthlyForm,
  };
}
