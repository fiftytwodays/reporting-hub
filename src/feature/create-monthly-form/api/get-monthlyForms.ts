import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";

interface FetchOptions {
  condition: boolean;
}

export function useMonthlyFormsList({ condition = true }: FetchOptions) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const response = await client.models.MonthlyForm.list();
    if (response?.data) {
      const monthlyForms = await Promise.all(
        response.data.map(async (form) => {
          const project = await client.models.Project.get({
            id: form.projectId ?? "",
          });
          const outcomes = await client.models.Outcome.list({
            filter: { monthlyFormId: { eq: form.id } },
          });

          return {
            id: form.id ?? "",
            projectId: form.projectId ?? "",
            projectName: project.data?.name ?? "",
            month: form.month ?? "",
            year: form.year ?? "",
            status: form.status ?? "",
            facilitator: form.facilitator ?? "",
            praisePoints: form.praisePoints ?? [],
            prayerRequests: form.prayerRequests ?? [],
            story: form.story ?? "",
            concerns: form.concerns ?? "",
            comments: form.comments ?? "",
            outcomes: outcomes.data ?? [],
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
    projectId: form.projectId,
    projectName: form.projectName,
    month: form.month,
    year: form.year,
    status: form.status,
    facilitator: form.facilitator,
    praisePoints: form.praisePoints,
    prayerRequests: form.prayerRequests,
    story: form.story,
    concerns: form.concerns,
    comments: form.comments,
    outcomes: form.outcomes,
  }));

  return {
    monthlyFormsList: monthlyFormsData ?? [],
    isMonthlyFormsListLoading: isLoading,
    isMonthlyFormsListError: error,
    reloadMonthlyFormsList,
  };
}
