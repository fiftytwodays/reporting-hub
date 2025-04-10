import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

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

export function useMonthlyFormsList({
  condition = true,
  projectId,
}: FetchOptions) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const anc = await client.models.MonthlyForm.list({});

    const response = await client.models.MonthlyForm.listMonthlyFormByProjectId(
      {
        projectId: projectId,
      }
    );
    if (response?.data) {
      const monthlyForms = await Promise.all(
        response.data
          .filter((form) => form.status === "waiting for approval")
          .map(async (form) => {
            const project = await client.models.Project.get({
              id: form.projectId ?? "",
            });

            return {
              id: form.id ?? "",
              // projectId: form.projectId ?? "",
              projectName: project.data?.name ?? "",
              location: project.data?.location ?? "",
              month: getMonthName(Number(form.month)) ?? "",
              year: form.year ?? "",
              status: form.status ?? "",
              facilitator: form.facilitator ?? "",
              // praisePoints: form.praisePoints ?? [],
              // prayerRequests: form.prayerRequests ?? [],
              // story: form.story ?? "",
              // concerns: form.concerns ?? "",
              // comments: form.comments ?? "",
            };
          })
      );

      monthlyForms.sort(
        (a, b) => a.month.localeCompare(b.month) || a.year.localeCompare(b.year)
      );

      return { MonthlyForms: monthlyForms };
    }
    return null;
  };

  const { data, isLoading, error } = useSWR(
    condition ? ["api/monthlyForms"] : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const reloadMonthlyFormsList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("api/monthlyForms")),
      undefined,
      {
        revalidate: true,
      }
    );
  };

  const monthlyFormsData = data?.MonthlyForms?.map((form, index) => ({
    key: index,
    id: form.id,
    name: form.projectName,
    month: form.month,
    year: form.year,
    status: form.status,
    facilitator: form.facilitator,
    location: form.location,
  }));

  return {
    monthlyFormsList: monthlyFormsData ?? [],
    isMonthlyFormsListLoading: isLoading,
    isMonthlyFormsListError: error,
    reloadMonthlyFormsList,
  };
}
