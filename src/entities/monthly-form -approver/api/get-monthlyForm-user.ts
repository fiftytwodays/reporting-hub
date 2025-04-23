import useSWR, { mutate } from "swr";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@root/amplify/data/resource";
import { fetchUserAttributes, getCurrentUser } from "@aws-amplify/auth";

interface FetchOptions {
  condition: boolean;
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

function stringToArray(str: string | undefined): string[] {
  if (!str) return [];
  const cleanedStr = str.replace(/[\[\]]/g, "").trim();
  if (!cleanedStr) return [];
  return cleanedStr.includes(",")
    ? cleanedStr.split(",").map((item) => item.trim())
    : [cleanedStr];
}

export function useMonthlyFormsListUser({ condition = true }: FetchOptions) {
  const client = generateClient<Schema>();

  const fetcher = async () => {
    const attributes = await fetchUserAttributes();

    const monthlyFormsAccumulated: any[] = [];
    const seenProjectIds = new Set<string>();

    if (condition) {
      const clustersArr = stringToArray(attributes["custom:clusters"]);

      let projectIds: string[] = [];

      // Get projects from clusters
      if (clustersArr.length > 0) {
        const projects = await client.models.Project.list({
          filter: {
            or: clustersArr.map((clusterId) => ({
              clusterId: { eq: clusterId },
            })),
          },
        });
        const ids =
          projects?.data.map((project) => project.id).filter(Boolean) || [];
        projectIds.push(...ids);
      }

      for (const projectId of projectIds) {
        seenProjectIds.add(projectId);
        const response =
          await client.models.MonthlyForm.listMonthlyFormByProjectId({
            projectId,
          });
        if (response?.data) {
          for (const form of response.data) {
            const project = await client.models.Project.get({
              id: form.projectId ?? "",
            });
            if (form.status === "submitted") {
              monthlyFormsAccumulated.push({
                id: form.id ?? "",
                projectName: project.data?.name ?? "",
                location: project.data?.location ?? "",
                month: getMonthName(Number(form.month)),
                year: form.year ?? "",
                status: form.status ?? "",
                facilitator: form.facilitator ?? "",
              });
            }
          }
        }
      }

      // Sort forms
      const sortedMonthlyForms = monthlyFormsAccumulated.sort(
        (a, b) => a.year.localeCompare(b.year) || a.month.localeCompare(b.month)
      );

      return { MonthlyForms: sortedMonthlyForms };
    }

    return { MonthlyForms: [] };
  };

  const { data, isLoading, error } = useSWR(
    condition ? ["api/approverview/monthlyForms"] : null,
    fetcher,
    { keepPreviousData: true }
  );

  const reloadMonthlyFormsList = () => {
    mutate(
      (keys) =>
        Array.isArray(keys) &&
        keys.some((item) => item.startsWith("api/approverview/monthlyForms")),
      undefined,
      { revalidate: true }
    );
  };

  const monthlyFormsData = data?.MonthlyForms?.map((form, index) => ({
    key: index,
    id: form?.id,
    name: form?.projectName,
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
